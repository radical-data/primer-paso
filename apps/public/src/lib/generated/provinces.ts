export const provinces = [
	{
		code: '01',
		name: 'Araba/Álava'
	},
	{
		code: '02',
		name: 'Albacete'
	},
	{
		code: '03',
		name: 'Alicante/Alacant'
	},
	{
		code: '04',
		name: 'Almería'
	},
	{
		code: '05',
		name: 'Ávila'
	},
	{
		code: '06',
		name: 'Badajoz'
	},
	{
		code: '07',
		name: 'Balears, Illes'
	},
	{
		code: '08',
		name: 'Barcelona'
	},
	{
		code: '09',
		name: 'Burgos'
	},
	{
		code: '10',
		name: 'Cáceres'
	},
	{
		code: '11',
		name: 'Cádiz'
	},
	{
		code: '12',
		name: 'Castellón/Castelló'
	},
	{
		code: '13',
		name: 'Ciudad Real'
	},
	{
		code: '14',
		name: 'Córdoba'
	},
	{
		code: '15',
		name: 'Coruña, A'
	},
	{
		code: '16',
		name: 'Cuenca'
	},
	{
		code: '17',
		name: 'Girona'
	},
	{
		code: '18',
		name: 'Granada'
	},
	{
		code: '19',
		name: 'Guadalajara'
	},
	{
		code: '20',
		name: 'Gipuzkoa'
	},
	{
		code: '21',
		name: 'Huelva'
	},
	{
		code: '22',
		name: 'Huesca'
	},
	{
		code: '23',
		name: 'Jaén'
	},
	{
		code: '24',
		name: 'León'
	},
	{
		code: '25',
		name: 'Lleida'
	},
	{
		code: '26',
		name: 'Rioja, La'
	},
	{
		code: '27',
		name: 'Lugo'
	},
	{
		code: '28',
		name: 'Madrid'
	},
	{
		code: '29',
		name: 'Málaga'
	},
	{
		code: '30',
		name: 'Murcia'
	},
	{
		code: '31',
		name: 'Navarra'
	},
	{
		code: '32',
		name: 'Ourense'
	},
	{
		code: '33',
		name: 'Asturias'
	},
	{
		code: '34',
		name: 'Palencia'
	},
	{
		code: '35',
		name: 'Palmas, Las'
	},
	{
		code: '36',
		name: 'Pontevedra'
	},
	{
		code: '37',
		name: 'Salamanca'
	},
	{
		code: '38',
		name: 'Santa Cruz de Tenerife'
	},
	{
		code: '39',
		name: 'Cantabria'
	},
	{
		code: '40',
		name: 'Segovia'
	},
	{
		code: '41',
		name: 'Sevilla'
	},
	{
		code: '42',
		name: 'Soria'
	},
	{
		code: '43',
		name: 'Tarragona'
	},
	{
		code: '44',
		name: 'Teruel'
	},
	{
		code: '45',
		name: 'Toledo'
	},
	{
		code: '46',
		name: 'Valencia/València'
	},
	{
		code: '47',
		name: 'Valladolid'
	},
	{
		code: '48',
		name: 'Bizkaia'
	},
	{
		code: '49',
		name: 'Zamora'
	},
	{
		code: '50',
		name: 'Zaragoza'
	},
	{
		code: '51',
		name: 'Ceuta'
	},
	{
		code: '52',
		name: 'Melilla'
	}
] as const

export type ProvinceValue = (typeof provinces)[number]['code']
export const PROVINCE_VALUES = provinces.map((province) => province.code) as ProvinceValue[]
export const provinceLabelByCode = Object.fromEntries(
	provinces.map((province) => [province.code, province.name])
) as Record<ProvinceValue, (typeof provinces)[number]['name']>
