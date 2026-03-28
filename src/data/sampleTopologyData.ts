import type { FlowRow, NetworkGraph, DataFlowGraph, ArchitectureGraph } from "@/types/mq-topology";

export const sampleRows: FlowRow[] = [
  { app_name: "OrderService", queue_manager: "QMA", queue_name: "ORDERS.IN", type: "producer" },
  { app_name: "FulfillmentService", queue_manager: "QMA", queue_name: "ORDERS.IN", type: "consumer" },
  { app_name: "FulfillmentService", queue_manager: "QMB", queue_name: "FULFIL.OUT", type: "producer" },
  { app_name: "NotificationService", queue_manager: "QMB", queue_name: "FULFIL.OUT", type: "consumer" },
  { app_name: "InventoryService", queue_manager: "QMA", queue_name: "ORDERS.IN", type: "consumer" },
  { app_name: "InventoryService", queue_manager: "QMC", queue_name: "STOCK.UPDATE", type: "producer" },
  { app_name: "ReportingService", queue_manager: "QMC", queue_name: "STOCK.UPDATE", type: "consumer" },
];

export const sampleNetworkGraph: NetworkGraph = {
  nodes: [
    { id: "QMA", label: "QMA" },
    { id: "QMB", label: "QMB" },
    { id: "QMC", label: "QMC" },
  ],
  edges: [
    { id: "ch1", source: "QMA", target: "QMB", label: "QMA.TO.QMB" },
    { id: "ch2", source: "QMB", target: "QMA", label: "QMB.TO.QMA" },
    { id: "ch3", source: "QMB", target: "QMC", label: "QMB.TO.QMC" },
    { id: "ch4", source: "QMC", target: "QMB", label: "QMC.TO.QMB" },
  ],
};

export const sampleDataFlowGraph: DataFlowGraph = {
  nodes: [
    { id: "OrderService", label: "OrderService" },
    { id: "FulfillmentService", label: "FulfillmentService" },
    { id: "NotificationService", label: "NotificationService" },
    { id: "InventoryService", label: "InventoryService" },
    { id: "ReportingService", label: "ReportingService" },
  ],
  hyperedges: [
    {
      id: "he1",
      queue: "ORDERS.IN",
      queueManager: "QMA",
      producers: ["OrderService"],
      consumers: ["FulfillmentService", "InventoryService"],
    },
    {
      id: "he2",
      queue: "FULFIL.OUT",
      queueManager: "QMB",
      producers: ["FulfillmentService"],
      consumers: ["NotificationService"],
    },
    {
      id: "he3",
      queue: "STOCK.UPDATE",
      queueManager: "QMC",
      producers: ["InventoryService"],
      consumers: ["ReportingService"],
    },
  ],
};

export const sampleArchitectureGraph: ArchitectureGraph = {
  appNodes: [
    { id: "OrderService", label: "OrderService" },
    { id: "FulfillmentService", label: "FulfillmentService" },
    { id: "NotificationService", label: "NotificationService" },
    { id: "InventoryService", label: "InventoryService" },
    { id: "ReportingService", label: "ReportingService" },
  ],
  qmNodes: [
    { id: "QMA", label: "QMA" },
    { id: "QMB", label: "QMB" },
    { id: "QMC", label: "QMC" },
  ],
  queueNodes: [
    { id: "ORDERS.IN@QMA", label: "ORDERS.IN", queueManager: "QMA" },
    { id: "FULFIL.OUT@QMB", label: "FULFIL.OUT", queueManager: "QMB" },
    { id: "STOCK.UPDATE@QMC", label: "STOCK.UPDATE", queueManager: "QMC" },
  ],
  appToQMEdges: [
    { app: "OrderService", qm: "QMA" },
    { app: "FulfillmentService", qm: "QMA" },
    { app: "FulfillmentService", qm: "QMB" },
    { app: "NotificationService", qm: "QMB" },
    { app: "InventoryService", qm: "QMA" },
    { app: "InventoryService", qm: "QMC" },
    { app: "ReportingService", qm: "QMC" },
  ],
  queueToQMEdges: [
    { queue: "ORDERS.IN@QMA", qm: "QMA" },
    { queue: "FULFIL.OUT@QMB", qm: "QMB" },
    { queue: "STOCK.UPDATE@QMC", qm: "QMC" },
  ],
  channelEdges: [
    { source: "QMA", target: "QMB", label: "QMA.TO.QMB" },
    { source: "QMB", target: "QMA", label: "QMB.TO.QMA" },
    { source: "QMB", target: "QMC", label: "QMB.TO.QMC" },
    { source: "QMC", target: "QMB", label: "QMC.TO.QMB" },
  ],
};
