import type { KnowledgeBase, Message, SourceDocument } from '../types';

export const mockKnowledgeBases: KnowledgeBase[] = [
  {
    id: 'kb-1',
    name: '产品文档',
    documentCount: 156,
    updatedAt: '2026-05-15',
  },
  {
    id: 'kb-2',
    name: '技术wiki',
    documentCount: 89,
    updatedAt: '2026-05-14',
  },
  {
    id: 'kb-3',
    name: '运维手册',
    documentCount: 42,
    updatedAt: '2026-05-10',
  },
];

export const mockSources: SourceDocument[] = [
  {
    id: 'src-1',
    title: '产品部署指南.pdf',
    sourceType: 'PDF',
    snippet: 'Kubernetes 部署配置需要设置 replicas、resources 和 health check 等关键参数...',
    similarity: 'high',
    updatedAt: '2026-05-12',
  },
  {
    id: 'src-2',
    title: '架构设计文档.md',
    sourceType: 'Markdown',
    snippet: '服务采用微服务架构，通过 API Gateway 进行统一路由和负载均衡...',
    similarity: 'medium',
    updatedAt: '2026-05-10',
  },
  {
    id: 'src-3',
    title: '权限管理说明.docx',
    sourceType: 'Word',
    snippet: '系统支持基于角色的访问控制（RBAC），包含管理员、普通用户和访客三种角色...',
    similarity: 'low',
    updatedAt: '2026-05-08',
  },
];

export const mockMessages: Message[] = [];

export const mockDeploymentResponse = `根据知识库中的文档，关于部署我有以下信息：

## Kubernetes 部署要点

1. **副本数配置**：建议生产环境设置 \`replicas: 3\`
2. **资源限制**：CPU 和内存需要在 \`resources.limits\` 中明确指定
3. **健康检查**：必须配置 \`livenessProbe\` 和 \`readinessProbe\`

## 部署步骤

\`\`\`bash
kubectl apply -f deployment.yaml
kubectl get pods -w
\`\`\`

详细的部署配置可以参考 [1]，架构设计可以参考 [2]。`;

export const mockPermissionResponse = `根据权限管理文档，系统采用 RBAC 模型：

## 角色说明

| 角色 | 权限范围 |
|------|----------|
| 管理员 | 全部权限，可管理用户和知识库 |
| 普通用户 | 读写自己的数据，可查询知识库 |
| 访客 | 只读权限，无法修改任何数据 |

## 权限验证流程

当用户发起请求时，系统会验证 JWT token 中的角色信息，并检查对应的权限列表 [3]。`;

export const mockGeneralResponse = `您好！我是 DeepMemo 智能问答助手。

## 示例问题

您可以尝试以下问题：

- **关于部署**：如"如何部署服务？"
- **关于权限**：如"如何设置用户权限？"

## 功能说明

我可以根据您选择的知识库，回答相关问题并提供引用来源。`;

export function getMockResponse(userMessage: string): { content: string; sources: SourceDocument[] } {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('部署')) {
    return {
      content: mockDeploymentResponse,
      sources: [mockSources[0], mockSources[1]],
    };
  }

  if (lowerMessage.includes('权限')) {
    return {
      content: mockPermissionResponse,
      sources: [mockSources[2]],
    };
  }

  return {
    content: mockGeneralResponse,
    sources: [],
  };
}

export const exampleQuestions = [
  '如何部署服务到 Kubernetes？',
  '如何配置用户权限？',
  '介绍一下系统架构',
];
