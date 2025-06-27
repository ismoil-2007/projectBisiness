let Api = 'https://685d742c769de2bf0860b8a9.mockapi.io/system'
let Api2 = 'https://685d742c769de2bf0860b8a9.mockapi.io/Murodullo'
let odam = document.querySelector('.odam')
odam.onchange = () => {
	Api =
		odam.value === 'Murodullo'
			? Api2
			: 'https://685d742c769de2bf0860b8a9.mockapi.io/system'
	getData()
}
let allCredit = document.querySelector('.allCredit')
import { getDataToTable } from './dom.js'

export async function getData() {
	try {
		let response = await fetch(Api)
		if (!response.ok) {
			throw new Error('Интернет кор накардест')
		}

		let data = await response.json()
		console.log(data)

		getDataToTable(data)
		allCredit.innerHTML = `<span>Қарз: ${data.reduce(
			(acc, cur) => acc + Number(cur.credit),
			0
		)} сомони</span>`
	} catch (error) {
		console.error(error)
	}
}
export async function searching(sear) {
	try {
		let response = await fetch(`${Api}?client=${sear}`)
		if (!response.ok) {
			throw new Error('Интернет кор накардест')
		}

		let data = await response.json()
		getDataToTable(data)
	} catch (error) {
		console.error(error)
	}
}
export async function postData(data) {
	try {
		let response = await fetch(Api, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		if (!response.ok) {
			alert('Интернет кор накардест аз нав кӯшиш кунед')
			throw new Error('Интернет кор накардест')
		}

		alert('Маълумотҳо муваффақият клиент илова шуд')
		getData()
	} catch (error) {
		alert('Маълумотҳо клиент илова нашуд')

		console.error(error)
	}
}

export async function deleteData(id) {
	try {
		let response = await fetch(`${Api}/${id}`, {
			method: 'DELETE',
		})
		if (!response.ok) {
			alert('Интернет кор накардест аз нав кӯшиш кунед')
			throw new Error('Интернет кор накардест')
		}
		alert('Маълумотҳо муваффақият удалить шуд')
		getData()
	} catch (error) {
		alert('Маълумотҳо клиент удалить нашуд')

		console.error(error)
	}
}

export async function putData(id, data) {
	try {
		let response = await fetch(`${Api}/${id}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		if (!response.ok) {
			alert('Интернет кор накардест аз нав кӯшиш кунед')
			throw new Error('Интернет кор накардест')
		}
		alert('Маълумотҳо муваффақият алиш када шуд')
		getData()
	} catch (error) {
		alert('Интернет кор накардест аз нав кӯшиш кунед')
		console.error(error)
	}
}
