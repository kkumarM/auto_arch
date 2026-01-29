from typing import List, Optional

from pydantic import BaseModel

from app.spec import ProjectSpec


class ValidationMessage(BaseModel):
    message: str
    nodeId: Optional[str] = None
    edgeId: Optional[str] = None


SERVICE_KEYWORDS = ("service", "api", "backend")
DB_KEYWORDS = ("db", "database", "postgres", "mysql", "mongo", "redis")


def _looks_like_service(kind: str) -> bool:
    lower = kind.lower()
    return any(k in lower for k in SERVICE_KEYWORDS)


def _looks_like_db(kind: str) -> bool:
    lower = kind.lower()
    return any(k in lower for k in DB_KEYWORDS)


def validate_spec(spec: ProjectSpec) -> List[ValidationMessage]:
    errors: List[ValidationMessage] = []

    # Node id uniqueness
    seen_ids = set()
    for node in spec.nodes:
        if node.id in seen_ids:
            errors.append(ValidationMessage(message="Duplicate node id", nodeId=node.id))
        seen_ids.add(node.id)

    # Name uniqueness (case-insensitive)
    seen_names = set()
    for node in spec.nodes:
        name_key = node.name.lower()
        if name_key in seen_names:
            errors.append(ValidationMessage(message="Duplicate node name", nodeId=node.id))
        seen_names.add(name_key)

    # Basic service checks
    for node in spec.nodes:
        if _looks_like_service(node.kind) and not node.ports:
            errors.append(
                ValidationMessage(
                    message="Service missing exposed port(s)",
                    nodeId=node.id,
                )
            )

        if _looks_like_db(node.kind):
            required_keys = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"]
            missing = [k for k in required_keys if k not in (node.env or {})]
            if spec.deploy.dbMode != "cloud" and missing:
                errors.append(
                    ValidationMessage(
                        message=f"Database missing credentials: {', '.join(missing)}",
                        nodeId=node.id,
                    )
                )

    # Edge endpoint validation
    node_ids = {n.id for n in spec.nodes}
    for edge in spec.edges:
        if edge.source not in node_ids:
            errors.append(
                ValidationMessage(
                    message="Edge source missing in nodes",
                    edgeId=edge.id,
                )
            )
        if edge.target not in node_ids:
            errors.append(
                ValidationMessage(
                    message="Edge target missing in nodes",
                    edgeId=edge.id,
                )
            )
        if edge.source == edge.target:
            errors.append(
                ValidationMessage(
                    message="Edge cannot loop to itself",
                    edgeId=edge.id,
                )
            )

    return errors


def validate_spec_ok(spec: ProjectSpec) -> bool:
    return len(validate_spec(spec)) == 0
