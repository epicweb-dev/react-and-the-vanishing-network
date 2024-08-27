'use server'

import * as db from '../db.js'

export async function updateCount(formData) {
	try {
		const currentCount = await db.getCount()
		const change = parseInt(formData.get('change'), 10)
		const newCount = currentCount + change
		await db.setCount(newCount)
		return { status: 'success', message: 'Success!' }
	} catch (error) {
		return { status: 'error', message: error?.message || String(error) }
	}
}
