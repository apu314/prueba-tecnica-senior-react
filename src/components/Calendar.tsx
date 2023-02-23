/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import date from 'date-and-time'
import { type FC, useEffect, useState } from 'react'

import calendar from '../../assets/calendar.json'
import employees from '../../assets/employees.json'
import { colors, months } from '../helpers/calendar'
import { type CalendarData, Color } from '../types/Calendar'
import { type Employee } from '../types/Employee'

const CalendarComponent: FC = () => {
  const [calendarState] = useState<CalendarData[]>(
    JSON.parse(localStorage.getItem('calendar')!) || calendar.datos || [],
  )
  const [employeesState, setEmployeesState] = useState<Employee[]>(
    JSON.parse(localStorage.getItem('employees')!) || employees.data || [],
  )

  useEffect(() => {
    if (!localStorage.getItem('calendar')) {
      localStorage.setItem('calendar', JSON.stringify(calendarState))
    }

    if (!localStorage.getItem('employees')) {
      localStorage.setItem('employees', JSON.stringify(employeesState))
    }
  }, [])

  useEffect(() => {
    if (employeesState.length === 0) return
    localStorage.setItem('employees', JSON.stringify(employeesState))
  }, [employeesState])

  const decomposeDate = (
    dateValue: number,
  ): {
    year: number
    month: number
    day: number
  } => {
    const dateValueString = `${dateValue}`

    const year = Number(dateValueString.substring(0, 4))
    const month = Number(dateValueString.substring(4, 6)) - 1
    const day = Number(dateValueString.substring(6, 8))

    return { year, month, day }
  }

  const formatDate = ({
    year,
    month,
    day,
  }: {
    year: number
    month: number
    day: number
  }): Date => {
    return new Date(year, month, day)
  }

  const getDayOfMonth = (dateValue: number): string => {
    const decomposedDate = decomposeDate(dateValue)
    const dateParsed = formatDate(decomposedDate)

    return date.format(dateParsed, 'D')
  }

  const getMonthNumber = (dateValue: number) => {
    const decomposedDate = decomposeDate(dateValue)
    const dateParsed = formatDate(decomposedDate)

    return date.format(dateParsed, 'M')
  }

  const getMonthName = (monthNumber: number): string => {
    return months[monthNumber]
  }

  const renderCalendarHeaderMonthsNames = () => {
    let monthNumber = 1
    let currentMonthDaysAccumulator = 0
    const monthsToRender: [{ monthName: string; totalMonthDays: number }?] = []

    for (let i = 0; i < calendarState.length; i++) {
      const currentMonthNumber = Number(getMonthNumber(calendarState[i].fecha))

      const monthName = getMonthName(monthNumber)

      // Means this iteration is the next month as the previous iteration
      if (i === calendarState.length - 1 || currentMonthNumber !== monthNumber) {
        if (i === calendarState.length - 1) {
          currentMonthDaysAccumulator++
        }
        monthsToRender.push({
          monthName,
          totalMonthDays: currentMonthDaysAccumulator,
        })

        monthNumber = currentMonthNumber
        currentMonthDaysAccumulator = 0
      }
      currentMonthDaysAccumulator++
    }

    const templateToRender = monthsToRender.map((monthToRender, index) => (
      <th
        key={index}
        colSpan={monthToRender?.totalMonthDays}
        style={{ border: '1px solid #000' }}
      >
        {monthToRender?.monthName}
      </th>
    ))

    return templateToRender
  }

  const getEmployeeDayOffColor = (
    day: number,
    dayColor: string,
    employeeDaysOff?: [number],
  ): string => {
    if (employeeDaysOff && employeeDaysOff.some((dayOff) => day === dayOff)) {
      // return colors[Color.Gris]
      return 'rgb(105,172,92)'
    }
    return colors[dayColor]
  }

  const getFontColorBasedOnBackground = (color: string): string => {
    let fontColor = ''

    if (
      colors[color] === colors[Color.Amarillo] ||
      colors[color] === colors[Color.Blanco]
    ) {
      fontColor = '#000'
    } else {
      fontColor = '#fff'
    }

    return fontColor
  }

  const getRemainingDaysOff = (employee: Employee): number => {
    let remainingDaysOff = 0
    if (!Object.prototype.hasOwnProperty.call(employee, 'daysOff')) {
      return employee.total_holidays
    }

    if (employee.daysOff) {
      remainingDaysOff = employee.total_holidays - employee.daysOff.length
    }

    return remainingDaysOff
  }

  const toggleEmployeeDayOff = (
    employeeId: number,
    day: number,
    dayTipoId: string,
    defaultDayColor: string,
  ): void => {
    if (defaultDayColor !== Color.Blanco || dayTipoId !== '') return

    const employeesDaysOffUpdated = employeesState.map((employee: Employee) => {
      if (employee.id !== employeeId) return employee
      let done = false

      const { total_holidays, daysOff } = employee

      const updatedDaysOff = daysOff! || []
      let updatedTotalHolidays: number = total_holidays

      if (daysOff && daysOff.some((dayOff) => dayOff === day)) {
        const remainingDaysOff = getRemainingDaysOff(employee)
        const indexToDelete = updatedDaysOff.indexOf(day)
        if (indexToDelete !== -1) updatedDaysOff.splice(indexToDelete, 1)
        if (remainingDaysOff < employee.total_holidays) updatedTotalHolidays += 1
        done = true
      }

      if (
        !done &&
        // (!employee.hasOwnProperty('daysOff') ||
        (!Object.prototype.hasOwnProperty.call(employee, 'daysOff') ||
          (daysOff && !daysOff.some((dayOff) => dayOff === day)))
      ) {
        updatedDaysOff.push(day)
        updatedTotalHolidays -= 1
      }

      return {
        ...employee,
        remainingHolidays: updatedTotalHolidays,
        daysOff: updatedDaysOff || [],
      }
    })

    setEmployeesState(() => {
      return employeesDaysOffUpdated
    })
  }

  const handleDateClick = (
    employeeId: number,
    day: number,
    dayTipoId: string,
    defaultDayColor: string,
  ): void => {
    toggleEmployeeDayOff(employeeId, day, dayTipoId, defaultDayColor)
  }

  return (
    <div>
      {calendarState && employeesState && (
        <table>
          <thead>
            <tr
              style={{
                position: 'relative',
              }}
            >
              <th
                rowSpan={2}
                style={{
                  position: 'sticky',
                  left: 0,
                  backgroundColor: '#fff',
                }}
              ></th>
              {renderCalendarHeaderMonthsNames()}
            </tr>
            <tr>
              {calendarState &&
                calendarState.map((dato) => (
                  <th
                    key={dato.fecha}
                    style={{
                      border: '1px solid #000',
                      backgroundColor: colors[dato.color],
                      color: getFontColorBasedOnBackground(dato.color),
                    }}
                  >
                    {getDayOfMonth(dato.fecha)}
                  </th>
                ))}
            </tr>
            <tr
              style={{
                outline: 'thin solid',
              }}
            >
              <th
                style={{
                  position: 'sticky',
                  left: 0,
                  textAlign: 'left',
                  padding: ' .5rem .5rem',
                }}
              >
                Empleados
              </th>
            </tr>
          </thead>

          <tbody>
            {employeesState &&
              employeesState.map((employee) => (
                <tr
                  key={employee.id}
                  style={{
                    position: 'relative',
                  }}
                >
                  <td
                    style={{
                      backgroundColor: '#fff',
                      border: '1px solid #000',
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0 0 0 .5rem',
                      position: 'sticky',
                      left: 0,
                      whiteSpace: 'nowrap',
                      height: '32px',
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        paddingRight: '.25rem',
                      }}
                    >{`${employee.first_name} ${employee.last_name}`}</span>
                    <span
                      style={{
                        backgroundColor: 'rgb(105,172,92)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '.05rem .5rem',
                        minWidth: '40px',
                        width: '40px',
                      }}
                    >{`${getRemainingDaysOff(employee)}/${
                      employee.total_holidays
                    }`}</span>
                  </td>
                  {calendarState &&
                    calendarState.map((day) => (
                      <td
                        key={`${employee.id}-${day.fecha}`}
                        onClick={() =>
                          handleDateClick(employee.id, day.fecha, day.tipoId, day.color)
                        }
                        style={{
                          border: '1px solid #000',
                          cursor: 'pointer',
                          width: '30px',
                          minWidth: '30px',
                          height: '30px',
                          backgroundColor: getEmployeeDayOffColor(
                            day.fecha,
                            day.color,
                            employee.daysOff,
                          ),
                        }}
                      ></td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default CalendarComponent
