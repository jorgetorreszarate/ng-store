export const bsDatepickerOptions = {
  containerClass: 'theme-dark-blue',
  adaptivePosition: true,
  selectWeekDateRange: true,
  showWeekNumbers: false,
  customTodayClass: 'custom-today',
  showPreviousMonth: false,
  showClearButton: true,
  displayMonths: 2,
  ranges: [
    {
      value: [new Date(), new Date()],
      label: 'Hoy'
    },
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 1)), new Date(new Date().setDate(new Date().getDate() - 1))],
      label: 'Ayer'
    },
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 1)), new Date()],
      label: 'Últimos 2 días'
    },
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 6)), new Date()],
      label: 'Últimos 7 días'
    },
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 13)), new Date()],
      label: 'Últimos 14 días'
    },
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()],
      label: 'Últimos 30 días'
    },    
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 60)), new Date()],
      label: 'Últimos 60 días'
    }
  ]
};