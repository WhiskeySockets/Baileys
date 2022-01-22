
export default () => {
	let task = Promise.resolve() as Promise<any>
	return {
	  mutex<T>(code: () => Promise<T>):Promise<T> {
			task = (async() => {
		  // wait for the previous task to complete
		  // if there is an error, we swallow so as to not block the queue
		  try {
					await task 
				} catch{ }

		  // execute the current task
		  return code()
			})()
			// we replace the existing task, appending the new piece of execution to it
			// so the next task will have to wait for this one to finish
			return task
	  },
	}
}
  