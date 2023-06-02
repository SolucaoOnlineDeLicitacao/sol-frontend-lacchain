export interface FileData {
	name: string;
	size: number;
	type: string;
	lastModified: number;
}
export interface AllLicitacao {
	_id: number;
	status?: string,
	description?: string,
	insurance?: string,
	classification?: string,
	initialDate?: string,
	closureDate?: string,
	timebreakerDays?: string,
	executionDays?: string,
	deliveryPlace?: string,
	biddingType?: string,
	modality?: string,
	batchName?: string,
	deliveryTimeDays?: string,
	deliveryPlaceLots?: string,
	quantity?: string,
	adicionalSite?: string,
	savedFile?: FileData | undefined,
}

export const licitacaoList: AllLicitacao[] = [
	{
		_id: 1,
		status: 'Aberto',
		description: 'Pregão eletrônico de manutenção',
		insurance: '132-456-5',
		classification: 'Bens',
		initialDate: '22-05-2019',
		closureDate: '23-05-2022',
		timebreakerDays: '1 dias',
		executionDays: '6 dia',
		deliveryPlace: 'Não informado',
		biddingType: 'Preço por Lote',
		modality: 'Aberta/Pública',
		batchName: 'string',
		deliveryTimeDays: '89 dias',
		deliveryPlaceLots: 'string',
		adicionalSite: 'Não informado',
		quantity: 'string',
	},
	{
		_id: 2,
		status: 'Aberto',
		description: 'Pregão eletrônico de manutenção',
		insurance: 'string',
		classification: 'string',
		initialDate: '22-05-2019',
		closureDate: '23-05-2022',
		timebreakerDays: 'string',
		executionDays: 'string',
		deliveryPlace: 'string',
		biddingType: 'string',
		modality: 'string',
		batchName: 'string',
		deliveryTimeDays: 'string',
		deliveryPlaceLots: 'string',
		adicionalSite: 'Não informado',
		quantity: 'string',
	},
]