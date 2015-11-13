from splice.models import Adgroup, AdgroupCategory, Tile
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import InvalidRequestError
from sqlalchemy.sql import exists, func

from splice.queries.common import row_to_dict


def needsAdgroupJoin(filters):
    adgroup_filters = ('adgroup_type', 'channel_id', 'locale')
    return all(k in filters for k in adgroup_filters)


def get_tiles(campaign_id=None, adgroup_id=None, group_by=None,
              limit_fields=None, filters=None):

    from splice.environment import Environment
    env = Environment.instance()

    filters = filters or {}
    fields = [Tile]
    formatRow = row_to_dict

    if group_by == 'category':
        fields = [AdgroupCategory.category, func.array_agg(Tile.id).label('tile_ids')]
        formatRow = (lambda r: r._asdict())
    elif limit_fields:
        fields = [getattr(Tile, field) for field in limit_fields]
        formatRow = (lambda r: r._asdict())

    # Base query
    rows = env.db.session.query(*fields)

    # Add joins / group by
    if group_by == 'category':
        rows = (
            rows
            .select_from(Tile)
            .join(AdgroupCategory, Tile.adgroup_id == AdgroupCategory.adgroup_id)
            .join(Adgroup, AdgroupCategory.adgroup_id == Adgroup.id)
            .group_by(AdgroupCategory.category)
        )
    else:
        rows = rows.order_by(Tile.id.desc())
    if (campaign_id or needsAdgroupJoin(filters)) and not group_by == 'category':
        rows = rows.join(Adgroup, Tile.adgroup_id == Adgroup.id)

    # Add filters
    if adgroup_id:
        rows = rows.filter(Tile.adgroup_id == adgroup_id)
    if campaign_id:
        rows = rows.filter(Adgroup.campaign_id == campaign_id)
    if 'type' in filters:
        rows = rows.filter(Tile.type == filters['type'])
    if 'adgroup_type' in filters:
        rows = rows.filter(Adgroup.type == filters['adgroup_type'])
    if 'channel_id' in filters:
        rows = rows.filter(Adgroup.channel_id == filters['channel_id'])
    if 'locale' in filters:
        rows = rows.filter(Adgroup.locale == filters['locale'])

    rows = rows.all()

    return [formatRow(r) for r in rows] if rows else None


def get_tile(id):
    from splice.environment import Environment

    env = Environment.instance()

    row = (
        env.db.session
        .query(Tile).get(id)
    )
    return row_to_dict(row) if row else None


def tile_exists(session, title, target_url, image_uri, enhanced_image_uri, tile_type, adgroup_id):
    ret = session.query(
        exists().
        where(Tile.title == title).
        where(Tile.target_url == target_url).
        where(Tile.image_uri == image_uri).
        where(Tile.enhanced_image_uri == enhanced_image_uri).
        where(Tile.type == tile_type).
        where(Tile.adgroup_id == adgroup_id)).scalar()
    return ret


def insert_tile(session, record):
    if not tile_exists(session, record["title"], record["target_url"],
                       record["image_uri"], record["enhanced_image_uri"],
                       record["type"], record["adgroup_id"]):
        tile = Tile(**record)
        session.add(tile)
        session.flush()

        return row_to_dict(tile)
    else:
        raise InvalidRequestError("Tile already exists")


def update_tile(session, tile_id, record):
    """ Tile is immutable once it gets created, the only field could be updated
    is the status.
    """
    tile = session.query(Tile).get(tile_id)
    if tile is None:
        raise NoResultFound("No result found")

    for key, val in record.items():
        setattr(tile, key, val)

    return row_to_dict(tile)
