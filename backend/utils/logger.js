let logs = [];

function addLog(agent, thought, action, input = null, output = null) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    agent,
    thought,
    action,
    input,
    output
  };
  logs.push(logEntry);
  // Keep the last 100 logs
  if (logs.length > 100) {
    logs.shift();
  }
}

function getLogs() {
  return logs;
}

function clearLogs() {
  logs = [];
}

module.exports = {
  addLog,
  getLogs,
  clearLogs
};
