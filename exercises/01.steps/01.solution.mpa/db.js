let count = 0

export async function getCount() {
	return count
}

export async function setCount(newCount) {
	count = newCount
}
