let count = 0

export function loader() {
	return { count }
}

export async function action({ request }) {
	const formData = await request.formData()
	const change = Number(formData.get('change'))
	if (!isNaN(change)) {
		count += change
	}
	return { count }
}
