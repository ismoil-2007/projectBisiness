// Импортируем API-функции
import { deleteData, getData, postData, putData, searching } from './api.js'

// Получаем DOM-элементы
const box = document.querySelector('.box')
const searchClient = document.querySelector('.searchClient')

// Поиск клиента при вводе текста
searchClient.oninput = () => {
	searching(searchClient.value)
}

// Кнопка добавления клиента
const addBtnClient = document.querySelector('.addBtnClient')

// Диалоговые окна
const editClientDialog = document.querySelector('.editClientDialog')
const dialogInfo = document.querySelector('.dialogInfo')
const addDialog = document.querySelector('.addDialog')

// Формы
const editClientForm = document.querySelector('.editClientForm')
const formAdd = document.querySelector('.formAdd')

// Инфо о клиенте
const placeInfo = document.querySelector('.placeInfo')
const clientInfo = document.querySelector('.clientInfo')
const creditInfo = document.querySelector('.creditInfo')
const pulInfo = document.querySelector('.pulInfo')

// Поля для работы с долгом
const qarzNimaInfo = document.querySelector('.qarzNimaInfo')
const plusInfo = document.querySelector('.plusInfo')
const minusInfo = document.querySelector('.minusInfo')
const sposobInfo = document.querySelector('.sposobInfo')

// Кнопки действий
const plusBtnInfo = document.querySelector('.plusBtnInfo')
const minusBtnInfo = document.querySelector('.minusBtnInfo')
const dialogInfoClose = document.querySelector('.dialogInfoClose')
const addDialogClose = document.querySelector('.addDialogClose')
const editClientDialogClose = document.querySelector('.editClientDialogClose')

// Закрытие диалоговых окон
editClientDialogClose.onclick = () => {
	editClientDialog.close()
	editClientForm.reset()
}

addDialogClose.onclick = () => {
	addDialog.close()
	formAdd.reset()
}

// Открытие формы добавления клиента
addBtnClient.onclick = () => {
	addDialog.showModal()
}

// Добавление нового клиента
formAdd.onsubmit = e => {
	e.preventDefault()

	const user = {
		client: formAdd.client.value,
		credit: formAdd.credit.value,
		place: formAdd.place.value,
		viruchka: [],
	}

	postData(user) // POST запрос
	addDialog.close()
	formAdd.reset() // Сброс формы
}

// Отрисовка данных на странице
export function getDataToTable(data) {
	box.innerHTML = '' // Очистка таблицы

	data.forEach((client, index) => {
		const tr = document.createElement('tr')

		const tdId = document.createElement('td')
		const tdClient = document.createElement('td')
		const tdCredit = document.createElement('td')
		const tdPlace = document.createElement('td')
		const tdInfo = document.createElement('td')

		tdId.textContent = index + 1
		tdClient.textContent = client.client
		tdCredit.textContent = `${client.credit} сомони`
		tdPlace.textContent = client.place

		// Кнопка информации
		const btnInfo = document.createElement('button')
		btnInfo.textContent = 'Информация'
		btnInfo.classList.add('btn', 'info-btn')

		btnInfo.onclick = () => {
			clientInfo.textContent = `Клиент: ${client.client}`
			creditInfo.innerHTML = `Қарз: ${client.credit} сомони<br>`
			placeInfo.textContent = `Ҷои нишаст: ${client.place}`

			dialogInfo.showModal()

			// Генерируем таблицу creditHistory (долги)
			let cntCreditHistory =
				'<table><tr><th>№</th><th>Дата</th><th>Сумма</th><th>Что купил</th><th>Действия</th></tr>'
			client.creditHistory?.forEach((ele, idx) => {
				cntCreditHistory += `
                <tr>
                    <td>${idx + 1}</td>
                    <td>${ele[0]}</td>
                    <td>${ele[1]}</td>
                    <td>${ele[2]}</td>
                    <td>
                        <button class="delete-history-btn" data-index="${idx}">Удалить</button>
                    </td>
                </tr>`
			})
			cntCreditHistory += '</table>'

			creditInfo.innerHTML += cntCreditHistory

			// Генерируем таблицу viruchka (выплаты)
			let cntPullInfo =
				'<table><tr><th>№</th><th>Дата</th><th>Сумма</th><th>Способ оплаты</th><th>Действия</th></tr>'
			client.viruchka?.forEach((el, idx) => {
				cntPullInfo += `
                <tr>
                    <td>${idx + 1}</td>
                    <td>${el[0]}</td>
                    <td>${el[1]}</td>
                    <td>${el[2]}</td>
                    <td>
                        <button class="delete-pull-btn" data-index="${idx}">Удалить</button>
                    </td>
                </tr>`
			})
			cntPullInfo += '</table>'

			pulInfo.innerHTML = cntPullInfo

			// Обработчики кнопок удаления из creditHistory
			dialogInfo.querySelectorAll('.delete-history-btn').forEach(button => {
				button.addEventListener('click', () => {
					const index = parseInt(button.getAttribute('data-index'))
					if (confirm('Удалить эту запись?')) {
						client.creditHistory.splice(index, 1)

						// Пересчитываем долг
						client.credit = client.creditHistory.reduce((sum, item) => {
							return sum + parseFloat(item[1])
						}, 0)

						putData(client.id, {
							...client,
							credit: client.credit,
							creditHistory: client.creditHistory,
						})
						dialogInfo.close()
						getData() // Обновляем данные
					}
				})
			})

			// Обработчики кнопок удаления из viruchka
			dialogInfo.querySelectorAll('.delete-pull-btn').forEach(button => {
				button.addEventListener('click', () => {
					const index = parseInt(button.getAttribute('data-index'))
					if (confirm('Удалить эту выплату?')) {
						const deletedAmount = parseFloat(client.viruchka[index][1])

						client.viruchka.splice(index, 1)

						// Увеличиваем долг обратно
						client.credit = Number(client.credit) + deletedAmount

						putData(client.id, {
							...client,
							credit: client.credit,
							viruchka: client.viruchka,
						})
						dialogInfo.close()
						getData() // Обновляем данные
					}
				})
			})

			// Кнопка увеличения долга
			plusBtnInfo.onclick = () => {
				if (qarzNimaInfo.value.trim() !== '') {
					const newDate = new Date()
					const formattedDate = `${newDate.getFullYear()}-${String(
						newDate.getMonth() + 1
					).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`

					client.creditHistory.push([
						formattedDate,
						`${plusInfo.value} сомони`,
						qarzNimaInfo.value,
					])

					putData(client.id, {
						...client,
						credit: Number(client.credit) + Number(plusInfo.value),
						creditHistory: client.creditHistory,
					})

					dialogInfo.close()
					plusInfo.value = ''
					qarzNimaInfo.value = ''
					getData() // Обновляем данные
				} else {
					alert('НИМА СОТИБ ОЛЛИ НОМИНИ КИРИТИНГ')
				}
			}

			// Кнопка уменьшения долга
			minusBtnInfo.onclick = () => {
				if (sposobInfo.value.trim() !== '' && minusInfo.value > 0) {
					const newDate = new Date()
					const formattedDate = `${newDate.getFullYear()}-${String(
						newDate.getMonth() + 1
					).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`

					client.viruchka.push([
						formattedDate,
						`${minusInfo.value} сомони`,
						sposobInfo.value,
					])

					const newCredit = Number(client.credit) - Number(minusInfo.value)

					if (newCredit < 0) {
						alert('Не может быть отрицательный долг!')
						return
					}

					putData(client.id, {
						...client,
						credit: newCredit,
						viruchka: client.viruchka,
					})

					dialogInfo.close()
					minusInfo.value = ''
					sposobInfo.value = ''
					getData() // Обновляем данные
				} else {
					alert('СПОСОБ ОПЛАТЫ ИЛИ СУММА НЕ ВВЕДЕНЫ')
				}
			}

			dialogInfoClose.onclick = () => {
				dialogInfo.close()
				plusInfo.value = ''
				minusInfo.value = ''
				sposobInfo.value = ''
				qarzNimaInfo.value = ''
			}
		}

		// Кнопка удаления клиента
		const btnDelete = document.createElement('button')
		btnDelete.textContent = 'Удалить'
		btnDelete.classList.add('btn', 'delete-btn')
		btnDelete.onclick = () => {
			if (confirm('Вы уверены, что хотите удалить клиента?')) {
				deleteData(client.id)
			}
		}

		// Кнопка редактирования клиента
		const btnEdit = document.createElement('button')
		btnEdit.textContent = 'Редактировать'
		btnEdit.classList.add('btn', 'edit-btn')

		btnEdit.onclick = () => {
			editClientDialog.showModal()
			editClientForm.client.value = client.client
			// editClientForm.credit.value = client.credit
			editClientForm.place.value = client.place

			editClientForm.onsubmit = e => {
				e.preventDefault()

				const updatedUser = {
					client: editClientForm.client.value,
					credit: client.credit, // credit не редактируется в форме
					place: editClientForm.place.value,
					viruchka: client.viruchka || [],
				}

				putData(client.id, updatedUser)
				editClientDialog.close()
				editClientForm.reset()
			}
		}

		// Добавляем кнопки в ячейку
		tdInfo.append(btnInfo, btnDelete, btnEdit)

		// Добавляем строки в таблицу
		tr.append(tdId, tdClient, tdCredit, tdPlace, tdInfo)
		box.appendChild(tr)
	})
}
