# Tasks

- [ ] Task 1: 基础设施
  - [ ] SubTask 1.1: 创建 spec.md
  - [ ] SubTask 1.2: 创建 tasks.md 和 checklist.md
  - [ ] SubTask 1.3: 新增海域阶段类型与资产配置类型
  - [ ] SubTask 1.4: 新增 lib/constants.ts 中的常量
  - [ ] SubTask 1.5: 创建海域阶段配置数据
  - [ ] SubTask 1.6: 创建海洋资产配置数据

- [ ] Task 2: 数值计算引擎
  - [ ] SubTask 2.1: 实现 calculateExp 基础能量计算函数
  - [ ] SubTask 2.2: 实现 grantExp 函数（计算并更新用户总EXP）
  - [ ] SubTask 2.3: 实现 getCurrentStage 工具函数（根据EXP获取当前海域阶段）
  - [ ] SubTask 2.4: 实现兑换功能（consumeExp + 发放道具）

- [ ] Task 3: UI 组件
  - [ ] SubTask 3.1: 实现 OceanStageHeader 组件（海域阶段头部展示）
  - [ ] SubTask 3.2: 实现 AssetGrid 组件（资产网格图鉴）
  - [ ] SubTask 3.3: 实现 EnergyBottle 组件（能量瓶兑换商店）
  - [ ] SubTask 3.4: 创建 components/ocean/index.ts 统一导出

- [ ] Task 4: 海域页面
  - [ ] SubTask 4.1: 重写 (tabs)/ocean.tsx 整合所有组件

# Task Dependencies
- Task 1 是所有任务的前置
- Task 2 依赖 Task 1
- Task 3 依赖 Task 1
- Task 4 依赖 Task 2、Task 3
