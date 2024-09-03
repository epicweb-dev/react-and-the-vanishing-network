document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('counter-form')
	const counterButtons = document.getElementById('counter-buttons')

	form.addEventListener('submit', async (event) => {
		event.preventDefault()

		const formData = new FormData(form)

		if (event.submitter) {
			formData.append(event.submitter.name, event.submitter.value)
		}

		counterButtons.style.opacity = '0.6'

		try {
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
		} finally {
			counterButtons.style.opacity = '1'
		}
	})
})
