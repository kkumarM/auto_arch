from app.spec.arch_spec_v1 import ProjectSpec, Node, Edge, Deploy, ProjectMeta
from app.validate.validate_spec import validate_spec


def build_min_spec():
    return ProjectSpec(
        project=ProjectMeta(name="demo", type="web"),
        nodes=[
            Node(
                id="svc1",
                kind="service",
                name="Service One",
                ports=[8000],
                env={},
            ),
            Node(
                id="db1",
                kind="database",
                name="Main DB",
                ports=[],
                env={
                    "DB_HOST": "localhost",
                    "DB_USER": "user",
                    "DB_PASSWORD": "pwd",
                    "DB_NAME": "db",
                },
            ),
        ],
        edges=[
            Edge(id="e1", source="svc1", target="db1"),
        ],
        deploy=Deploy(target="compose", gateway=True, dbMode="local"),
    )


def test_validate_spec_ok():
    spec = build_min_spec()
    errors = validate_spec(spec)
    assert errors == []


def test_validate_spec_catches_missing_ports_and_bad_edge():
    spec = build_min_spec()
    # Remove ports from service
    spec.nodes[0].ports = []
    # Edge targets missing node
    spec.edges[0].target = "missing"

    errors = validate_spec(spec)

    # Expect two distinct errors
    messages = [e.message for e in errors]
    assert any("Service missing exposed port" in m for m in messages)
    assert any("Edge target missing in nodes" in m for m in messages)
    assert any(e.nodeId == "svc1" for e in errors)
    assert any(e.edgeId == "e1" for e in errors)
