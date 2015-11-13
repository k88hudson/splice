from splice.models import impression_stats_daily
from splice.queries.tile import get_tiles
from sqlalchemy.sql import func
from sqlalchemy.orm import aliased
from sqlalchemy import case


def get_stats(group_by, filters=None):
    from splice.environment import Environment
    env = Environment.instance()

    isd = aliased(impression_stats_daily)
    filters = filters or {}
    campaign_id = filters.get('campaign_id', None)
    base_table = isd
    tiles = []

    # Fields
    if group_by == 'category':
        grouped_tiles = get_tiles(campaign_id=campaign_id, group_by='category', filters=filters)
        if not grouped_tiles:
            return None
        for c in grouped_tiles:
            for tile in c['tile_ids']:
                tiles.append(tile)

        category = case(map(
            (lambda item: (isd.c.tile_id.in_(item['tile_ids']), item['category'])),
            grouped_tiles
        ))

        base_table = (
            env.db.session.query(
                category.label('category'),
                isd.c.date,
                isd.c.tile_id,
                isd.c.impressions,
                isd.c.clicks,
                isd.c.pinned,
                isd.c.blocked,
                isd.c.country_code
            )
            .filter(isd.c.tile_id.in_(tiles))
        ).subquery()

        group_by_column = base_table.c.category

    else:
        tiles = get_tiles(campaign_id=campaign_id, limit_fields=['id'], filters=filters)
        if not tiles:
            return None
        else:
            tiles = [t['id'] for t in tiles]

        group_by_column = {
            'date': isd.c.date,
            'week': isd.c.week,
            'month': isd.c.month,
            'locale': isd.c.locale,
            'country_code': isd.c.country_code
        }.get(group_by)

    # Base query
    rows = (
        env.db.session
        .query(
            group_by_column,
            func.sum(base_table.c.impressions).label('impressions'),
            func.sum(base_table.c.clicks).label('clicks'),
            func.sum(base_table.c.pinned).label('pinned'),
            func.sum(base_table.c.blocked).label('blocked')
        )
        .group_by(group_by_column)
        .order_by(group_by_column)
    )

    # Filters
    if not group_by == 'category':
        rows = rows.filter(base_table.c.tile_id.in_(tiles))
    if 'country_code' in filters:
        rows = rows.filter(base_table.c.country_code == filters['country_code'])
    if 'start_date' in filters:
        rows = rows.filter(base_table.c.date >= filters['start_date'])
    if 'end_date' in filters:
        rows = rows.filter(base_table.c.date <= filters['end_date'])

    rows = rows.all()

    return [r._asdict() for r in rows] if rows else None
