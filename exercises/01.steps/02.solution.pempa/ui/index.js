document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('counter-form')

	form.addEventListener('submit', async (event) => {
		event.preventDefault()

		const formData = new FormData(form)

		if (event.submitter) {
			formData.append(event.submitter.name, event.submitter.value)
		}

		const response = await fetch(form.action, {
			method: form.method,
			body: formData,
		})
		if (response.ok) {
			const { count } = await response.json()
			document.getElementById('count').innerText = `Count: ${count}`
		} else {
			console.error('Failed to update the count')
		}
	})
})
