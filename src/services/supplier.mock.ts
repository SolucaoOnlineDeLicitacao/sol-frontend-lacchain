export interface AllSuppliers {
  _id: number;
  block?: boolean;
  name?: string;
  document: string;
  county?: string;
  zip?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  publicPlace?: string;
  number?: string;
  complement?: string;
  reference?: string;
  latitude?: string;
  longitude?: string;
  referencePoint?: string;
  legalName?: string;
  legalDocument?: string;
  legalCounty?: string;
  legalZip?: string;
  legalState?: string;
  legalCity?: string;
  legalNeighborhood?: string;
  legalPublicPlace?: string;
  legalNumber?: string;
  legalComplement?: string;
  legalReference?: string;
  legalLatitude?: string;
  legalLongitude?: string;
  legalReferencePoint?: string;
  nationality?: string;
  maritalStatus?: string;
  cpf?: string;
  rg?: string;
  validityData?: string;
  categories?: any;
}
export const supplierList: AllSuppliers[] = [
  {
    _id: 1,
    block: false,
    name: 'Fornecedor 1',
    document: '65415282563',
    county: 'Brasil',
    zip: '72305500',
    state: 'MG',
    city: 'Alagoa',
    neighborhood: 'Serra velha',
    publicPlace: '',
    number: '2',
    complement: 'QNA 12 A 213',
    reference: 'Galpão ao lado de um posto de gasolina',
    latitude: '652161651',
    longitude: '54516515',
    referencePoint: '',
    legalName: 'Fornecedor 1',
    legalDocument: '65415282563',
    legalCounty: 'Brasília',
    legalZip: '7546515650',
    legalState: 'DF',
    legalCity: 'Brasília',
    legalNeighborhood: '',
    legalPublicPlace: '',
    legalNumber: '2',
    legalComplement: '',
    legalReference: '',
    legalLatitude: '',
    legalLongitude: '',
    legalReferencePoint: '',
    nationality: 'Brasileiro',
    maritalStatus: 'Casado',
    cpf: '06447208146',
    rg: '34915454',
    validityData: '',
    categories: ['107 - Bens Máquinas e Ferramentas', '105 - Bens Máquinas e Ferramentas'],
  },
  {
    _id: 2,
    block: true,
    name: 'Fornecedor 2',
    document: '78953245165',
    county: 'Brasil',
    zip: '72305500',
    state: 'PA',
    city: 'Belém',
    neighborhood: '',
    publicPlace: '',
    number: '2',
    complement: 'QNA 12 A 213',
    reference: 'Galpão ao lado de um posto de gasolina',
    latitude: '652161651',
    longitude: '54516515',
    referencePoint: '',
    legalName: 'Fornecedor 1',
    legalDocument: '78953245165',
    legalCounty: 'Brasília',
    legalZip: '7546515650',
    legalState: 'DF',
    legalCity: 'Brasília',
    legalNeighborhood: '',
    legalPublicPlace: '',
    legalNumber: '2',
    legalComplement: '',
    legalReference: '',
    legalLatitude: '',
    legalLongitude: '',
    legalReferencePoint: '',
    nationality: 'Brasileiro',
    maritalStatus: 'Casado',
    cpf: '06447208146',
    rg: '34915454',
    validityData: '',
    categories: ['107 - Bens Máquinas e Ferramentas', '105 - Bens Máquinas e Ferramentas'],
  },
  {
    _id: 3,
    block: false,
    name: 'Fornecedor 3',
    document: '12485675215',
    county: 'Brasil',
    zip: '72305500',
    state: 'SP',
    city: 'Leme',
    neighborhood: 'Taguatinga',
    publicPlace: '',
    number: '2',
    complement: 'QNA 12 A 213',
    reference: 'Galpão ao lado de um posto de gasolina',
    latitude: '652161651',
    longitude: '54516515',
    referencePoint: '',
    legalName: 'Fornecedor 1',
    legalDocument: '12485675215',
    legalCounty: 'Brasília',
    legalZip: '7546515650',
    legalState: 'DF',
    legalCity: 'Brasília',
    legalNeighborhood: '',
    legalPublicPlace: '',
    legalNumber: '2',
    legalComplement: '',
    legalReference: '',
    legalLatitude: '',
    legalLongitude: '',
    legalReferencePoint: '',
    nationality: 'Brasileiro',
    maritalStatus: 'Casado',
    cpf: '06447208146',
    rg: '34915454',
    validityData: '',
    categories: ['107 - Bens Máquinas e Ferramentas', '105 - Bens Máquinas e Ferramentas'],
  },
]