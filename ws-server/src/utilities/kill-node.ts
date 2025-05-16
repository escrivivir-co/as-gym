function killAllNodeProcesOnWindows() {
  if (process.platform === "win32") {
    const { exec } = require("child_process");
    exec("taskkill /F /IM node.exe", (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.error(`Error killing node processes: ${error}`);
        return;
      }
      console.log(`Killed node processes: ${stdout}`);
    });
  }
}

function killAllNodeProcessOnLinux() {
  if (process.platform === "linux") {
    const { exec } = require("child_process");
    exec("pkill -f node", (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.error(`Error killing node processes: ${error}`);
        return;
      }
      console.log(`Killed node processes: ${stdout}`);
    });
  }
}

function killAllNodeProcessOnMac() {
  if (process.platform === "darwin") {
    const { exec } = require("child_process");
    exec("pkill -f node", (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.error(`Error killing node processes: ${error}`);
        return;
      }
      console.log(`Killed node processes: ${stdout}`);
    });
  }
}

export function killAllNodeProcess() {
  if (process.platform === "win32") {
    killAllNodeProcesOnWindows();
  } else if (process.platform === "linux") {
    killAllNodeProcessOnLinux();
  } else if (process.platform === "darwin") {
    killAllNodeProcessOnMac();
  } else {
    console.error("Unsupported platform");
  }
}
