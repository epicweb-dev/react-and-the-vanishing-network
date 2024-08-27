document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('counter-form')
	form.addEventListener('submit', async function (event) {
		event.preventDefault()

		const formData = new FormData(form)

		if (event.submitter) {
			formData.append(event.submitter.name, event.submitter.value)
		}

		const actionUrl = form.getAttribute('action')
		const method = form.getAttribute('method')
		const response = await fetch(actionUrl, {
			method: method,
			body: formData,
		})
		if (response.ok) {
			const { count } = await response.json()
			document.getElementById('count').innerText = 'Count: ' + count
		} else {
			console.error('Failed to update the count')
		}
	})
})
