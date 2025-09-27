export type ClientType = {
  client_id: number
  display_name: string
  name: string
  surname: string
  patronymic: string
  phone: string
  email: string
  importance: number
  sex: number
  discount: number
  card: string
  balance: number
  paid_money: number
  date: string
  bd_day: number
  bd_month: number
  bd_year: number
  sms_not: number
  comment: string
  online_booking_ban: number
  labels: string[]
  money: number
  visits_count: number
  mobile_app: any[]
  image: string
  additional_phone: string
  client_card_installed: boolean
  custom_fields: ClientTypeCustomFields
  client_agreements: ClientTypeAgreements
}

export type ClientTypeCustomFields = Record<string, string>;

export type ClientTypeAgreements = {
  id: number
  client_id: number
  salon_id: number
  company_id: number
  is_newsletter_allowed: boolean
  is_personal_data_processing_allowed: boolean
}