import { Edge as RFEdge, Node as RFNode } from 'reactflow';

export type DeployTarget = 'compose' | 'k8s';

export interface ProjectMeta {
  name: string;
  type?: string;
  description?: string;
}

export interface Resources {
  cpu?: string;
  memory?: string;
}

export interface Security {
  tls?: boolean;
  notes?: string;
}

export interface Storage {
  type?: string;
  size?: string;
  path?: string;
}

export interface NodeSpec {
  id: string;
  kind: string;
  name: string;
  runtime?: string;
  ports: number[];
  env: Record<string, string>;
  resources?: Resources;
  security?: Security;
  storage?: Storage;
  metadata: Record<string, unknown>;
}

export interface EdgeSpec {
  id: string;
  source: string;
  target: string;
  protocol?: string;
  direction?: 'uni' | 'bi';
  security?: Security;
  metadata: Record<string, unknown>;
}

export interface DeploySpec {
  target: DeployTarget;
  gateway: boolean;
  dbMode?: string;
  outputName?: string;
  metadata: Record<string, unknown>;
}

export interface ProjectSpec {
  version: 'v1';
  project: ProjectMeta;
  nodes: NodeSpec[];
  edges: EdgeSpec[];
  deploy: DeploySpec;
}

export interface ConvertOptions {
  projectName?: string;
  projectType?: string;
  deployTarget?: DeployTarget;
  gateway?: boolean;
  dbMode?: string;
  outputName?: string;
}

const toNumberArray = (value: unknown): number[] => {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) {
    return value
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v));
  }
  const num = Number(value);
  return Number.isNaN(num) ? [] : [num];
};

export const reactFlowToSpecV1 = (
  nodes: RFNode[],
  edges: RFEdge[],
  options: ConvertOptions = {}
): ProjectSpec => {
  const nodeSpecs: NodeSpec[] = nodes.map((node) => {
    const data = node.data || {};
    const ports = toNumberArray((data as any).port || (data as any).ports);

    return {
      id: node.id,
      kind: String(data.type || node.type || 'component'),
      name: String(data.label || node.id),
      runtime: (data as any).runtime,
      ports,
      env: (data as any).env || {},
      resources: (data as any).resources,
      security: (data as any).security || ((data as any).tls ? { tls: true } : undefined),
      storage: (data as any).storage,
      metadata: {
        ...data,
        position: node.position,
      },
    };
  });

  const edgeSpecs: EdgeSpec[] = edges.map((edge) => {
    const data = edge.data || {};
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      protocol: (data as any).protocol || 'http',
      direction: ((data as any).direction === 'bi' ? 'bi' : 'uni') as 'uni' | 'bi',
      security: (data as any).tls ? { tls: true } : undefined,
      metadata: data as Record<string, unknown>,
    };
  });

  const deploy: DeploySpec = {
    target: options.deployTarget || 'compose',
    gateway: options.gateway ?? true,
    dbMode: options.dbMode,
    outputName: options.outputName || options.projectName || 'generated_project',
    metadata: {},
  };

  return {
    version: 'v1',
    project: {
      name: options.projectName || 'untitled-project',
      type: options.projectType,
    },
    nodes: nodeSpecs,
    edges: edgeSpecs,
    deploy,
  };
};
