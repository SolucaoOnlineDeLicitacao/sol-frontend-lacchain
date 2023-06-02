
export interface AllContrato {
	_id: number,
	status?: string,
	name?: string,
	insuranceNumber?: string,
	object?: string,
	situation?: string,
	executionCounty?: string,
	insuranceValue?: string,
	signatureDate?: string,
	validityDate?: string,
	association?: string,
	proofreader?: string,
}

export const contratoList: AllContrato[] = [
	{
		_id: 1,
		status: 'Em andamento',
		name: 'Contrato 214/2019',
		insuranceNumber: '008217',
		object: '00000000/2020',
		situation: 'Em espera',
		executionCounty: 'Monte Santo / BA',
		insuranceValue: 'R$ 000.000,00',
		signatureDate: '00/00/0000',
		validityDate: '00/00/0000',
		association: 'Nome da Associação',
		proofreader: 'Adm Geral',
	},
	{
		_id: 2,
		status: 'Em andamento',
		name: 'Contrato 618/2019',
		insuranceNumber: '008580',
		object: '00000000/2020',
		situation: 'Em espera',
		executionCounty: 'Monte Santo / BA',
		insuranceValue: 'R$ 000.000,00',
		signatureDate: '00/00/0000',
		validityDate: '00/00/0000',
		association: 'Nome da Associação',
		proofreader: 'Adm Geral',
	},
]