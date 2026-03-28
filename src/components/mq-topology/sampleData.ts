export const sampleData = {
  nodeDataArray: [
    { key: "QM1", text: "QM_PRODUCTION", isGroup: true, category: "queueManager" },
    { key: "QM2", text: "QM_DEVELOPMENT", isGroup: true, category: "queueManager" },
    { key: "QM3", text: "QM_GATEWAY", isGroup: true, category: "queueManager" },

    { key: "Q1", text: "APP.REQUEST.Q", group: "QM1", category: "queue" },
    { key: "Q2", text: "APP.REPLY.Q", group: "QM1", category: "queue" },
    { key: "Q3", text: "DLQ.PRODUCTION", group: "QM1", category: "queue" },
    { key: "Q4", text: "XMIT.QM_GATEWAY", group: "QM1", category: "queue", isTransmission: true },

    { key: "Q5", text: "DEV.REQUEST.Q", group: "QM2", category: "queue" },
    { key: "Q6", text: "DEV.REPLY.Q", group: "QM2", category: "queue" },
    { key: "Q7", text: "DLQ.DEVELOPMENT", group: "QM2", category: "queue" },
    { key: "Q8", text: "XMIT.QM_GATEWAY", group: "QM2", category: "queue", isTransmission: true },

    { key: "Q9", text: "GW.INBOUND.Q", group: "QM3", category: "queue" },
    { key: "Q10", text: "GW.OUTBOUND.Q", group: "QM3", category: "queue" },
    { key: "Q11", text: "DLQ.GATEWAY", group: "QM3", category: "queue" },
    { key: "Q12", text: "XMIT.QM_PROD", group: "QM3", category: "queue", isTransmission: true },
    { key: "Q13", text: "XMIT.QM_DEV", group: "QM3", category: "queue", isTransmission: true },
  ],
  linkDataArray: [
    { from: "QM1", to: "QM3", text: "QM1.TO.GW", category: "channel" },
    { from: "QM3", to: "QM1", text: "GW.TO.QM1", category: "channel" },
    { from: "QM2", to: "QM3", text: "QM2.TO.GW", category: "channel" },
    { from: "QM3", to: "QM2", text: "GW.TO.QM2", category: "channel" },
  ],
};
