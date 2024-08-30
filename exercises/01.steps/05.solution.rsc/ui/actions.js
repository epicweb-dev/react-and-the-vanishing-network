'use server'

import * as db from '../db.js'

export async function updateCount(formData) {
	try {
		const change = Number(formData.get('change'))
		await db.changeCount(change)
		return { status: 'success', message: 'Success!' }
	} catch (error) {
		return { status: 'error', message: error?.message || String(error) }
	}
}
