export const makeMutex = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let task = Promise.resolve();
    let taskTimeout;
    return {
        mutex(code) {
            task = (async () => {
                // wait for the previous task to complete
                // if there is an error, we swallow so as to not block the queue
                try {
                    await task;
                }
                catch { }
                try {
                    // execute the current task
                    const result = await code();
                    return result;
                }
                finally {
                    clearTimeout(taskTimeout);
                }
            })();
            // we replace the existing task, appending the new piece of execution to it
            // so the next task will have to wait for this one to finish
            return task;
        }
    };
};
export const makeKeyedMutex = () => {
    const map = {};
    return {
        mutex(key, task) {
            if (!map[key]) {
                map[key] = makeMutex();
            }
            return map[key].mutex(task);
        }
    };
};
//# sourceMappingURL=make-mutex.js.map