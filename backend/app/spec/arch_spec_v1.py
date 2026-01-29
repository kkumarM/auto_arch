from typing import Dict, List, Literal, Optional, Any

from pydantic import BaseModel, Field


class ProjectMeta(BaseModel):
    name: str
    type: Optional[str] = None
    description: Optional[str] = None


class Resources(BaseModel):
    cpu: Optional[str] = None
    memory: Optional[str] = None


class Security(BaseModel):
    tls: Optional[bool] = None
    notes: Optional[str] = None


class Storage(BaseModel):
    type: Optional[str] = None  # e.g. postgres, s3, local
    size: Optional[str] = None  # e.g. 10Gi
    path: Optional[str] = None


class Node(BaseModel):
    id: str
    kind: str
    name: str
    runtime: Optional[str] = None  # e.g. fastapi, node, nextjs
    ports: List[int] = Field(default_factory=list)
    env: Dict[str, str] = Field(default_factory=dict)
    resources: Optional[Resources] = None
    security: Optional[Security] = None
    storage: Optional[Storage] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class Edge(BaseModel):
    id: str
    source: str
    target: str
    protocol: Optional[str] = "http"
    direction: Optional[Literal["uni", "bi"]] = "uni"
    security: Optional[Security] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class Deploy(BaseModel):
    target: Literal["compose", "k8s"] = "compose"
    gateway: bool = False
    dbMode: Optional[str] = None  # local | cloud | mixed
    outputName: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ProjectSpec(BaseModel):
    version: Literal["v1"] = "v1"
    project: ProjectMeta
    nodes: List[Node]
    edges: List[Edge]
    deploy: Deploy
