let count = 0

export async function getCount() {
	return count
}

export async function changeCount(change) {
	count += change
	return count
}
