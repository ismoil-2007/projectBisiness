// Импортируем API-функции
import { deleteData, getData, postData, putData, searching } from './api.js'


const offlineWarning = document.getElementById('offline-warning')
const allButtons = document.querySelectorAll('button') // Все кнопки на странице

// Функция: отключить все кнопки
// сделай так чтобы все открытие dialog close
function blockActions() {
  offlineWarning.style.display = 'block'
	allButtons.forEach(btn => btn.setAttribute('disabled', true))
	dialogInfo.close()
	editClientDialog.close()
	addDialog.close()
}

// Функция: разрешить действия
function unblockActions() {
  offlineWarning.style.display = 'none'
  allButtons.forEach(btn => btn.removeAttribute('disabled'))
}

// Проверка при загрузке страницы
window.addEventListener('load', () => {
  if (!navigator.onLine) {
    blockActions()
  } else {
    unblockActions()
    getData() // Загружаем данные с сервера
  }
})

// Слушаем события изменения подключения
window.addEventListener('online', () => {
  unblockActions()
  getData() // Обновляем данные с сервера
})

window.addEventListener('offline', () => {
  blockActions()
})

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
let qarzNechiInfo = document.querySelector('.qarzNechiInfo')
let qarzNarkhInfo = document.querySelector('.qarzNarkhInfo')

const plusInfo = document.querySelector('.plusInfo')
const minusInfo = document.querySelector('.minusInfo')
const sposobInfo = document.querySelector('.sposobInfo')

// Кнопки действий
const plusBtnInfo = document.querySelector('.plusBtnInfo')
const minusBtnInfo = document.querySelector('.minusBtnInfo')
const dialogInfoClose = document.querySelector('.dialogInfoClose')
const addDialogClose = document.querySelector('.addDialogClose')
const editClientDialogClose = document.querySelector('.editClientDialogClose')
let spisatDolgDate = document.querySelector('.spisatDolgDate')
spisatDolgDate.value = new Date().toISOString().split('T')[0] // Устанавливаем текущую дату
let addDolgDate = document.querySelector('.addDolgDate')
addDolgDate.value = new Date().toISOString().split('T')[0] // Устанавливаем текущую дату
let dataToday = document.querySelector('.dataToday')
let dataToday22 = document.querySelector('.dataToday22')


dataToday.textContent = `Дата: ${new Date().toLocaleDateString('ru-RU', {
	year: 'numeric',
	month: 'long',
	day: 'numeric'
})}`

dataToday22.innerHTML = dataToday.innerHTML
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
					const newDate = addDolgDate.value ? new Date(addDolgDate.value) : new Date()
					const formattedDate = `${newDate.getFullYear()}-${String(
						newDate.getMonth() + 1
					).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`

					client.creditHistory.push([
						formattedDate,
						`${Number(Number(qarzNechiInfo.value) * Number(qarzNarkhInfo.value))} сомони`,
						qarzNimaInfo.value+` ${qarzNechiInfo.value}штX${qarzNarkhInfo.value} сомони`,
					])

					putData(client.id, {
						...client,
						credit: Number(client.credit) + Number(Number(qarzNechiInfo.value) * Number(qarzNarkhInfo.value)),
						creditHistory: client.creditHistory,
					})

					dialogInfo.close()
					plusInfo.value = ''
					qarzNechiInfo.value = ''
					qarzNarkhInfo.value = ''
					
					qarzNimaInfo.value = ''
					getData() // Обновляем данные
				} else {
					alert('НИМА СОТИБ ОЛЛИ НОМИНИ КИРИТИНГ')
				}
			}

			// Кнопка уменьшения долга
			minusBtnInfo.onclick = () => {
				if (sposobInfo.value.trim() !== '' && minusInfo.value > 0) {
					const newDate = spisatDolgDate.value ? new Date(spisatDolgDate.value) : new Date()
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
				qarzNechiInfo.value = ''
			
				qarzNarkhInfo.value = ''
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
