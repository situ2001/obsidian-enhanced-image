import { Notice } from "obsidian";
import pTimeout from "p-timeout";


export async function timeout<T>(promise: Promise<T>, config: {
  milliseconds?: number;
  message?: string;
} | undefined = undefined): Promise<T> {
  if (!config) {
    config = {
      milliseconds: 5000,
      message: ""
    };
  }
  if (!config.milliseconds) {
    config.milliseconds = 5000;
  }
  if (!config.message) {
    config.message = "";
  }

  const { milliseconds, message } = config;

  try {
    return await pTimeout(promise, {
      milliseconds,
      message
    });
  } catch (e) {
    console.error(e.message);
    new Notice(e.message);
    throw e;
  }
}
