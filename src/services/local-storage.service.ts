import { Injectable } from '@angular/core';
import { LocalStorageEnum } from 'src/app/interface/localstorage.enum';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  getConvenio() {
    const data = localStorage.getItem(LocalStorageEnum.convenio);
    return data === null ? undefined : JSON.parse(data);
  }

  getEditConvenio() {
    const data = localStorage.getItem(LocalStorageEnum.editconvenio);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataLicitacao() {
    const data = localStorage.getItem(LocalStorageEnum.licitacao);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataLote() {
    const data = localStorage.getItem(LocalStorageEnum.lote);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataProposal() {
    const data = localStorage.getItem(LocalStorageEnum.enviarproposta);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataContratos() {
    const data = localStorage.getItem(LocalStorageEnum.contrato);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataCostItems() {
    const data = localStorage.getItem(LocalStorageEnum.editcostitems);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataProdutos() {
    const data = localStorage.getItem(LocalStorageEnum.editprodutos);
    return data === null ? undefined : JSON.parse(data);
  }

  getDataCategoria() {
    const data = localStorage.getItem(LocalStorageEnum.editcategoria);
    return data === null ? undefined : JSON.parse(data);
  }
}