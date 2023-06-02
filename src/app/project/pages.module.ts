import { AuthGuard } from './../guard/auth.guard';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesAppComponent } from './pages.app.component';
import { ControlAdministracaoComponent } from "./control-administracao/control-administracao.component";
import { ControlAssociacaoComponent } from "./control-associacao/control-associacao.component";
import { ControlFornecedorComponent } from "./control-fornecedor/control-fornecedor.component";
import { ConveniosComponent } from "./convenios/convenios.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FornecedorComponent } from "./fornecedor/fornecedor.component";
import { IntegracoesComponent } from "./integracoes/integracoes.component";
import { PagesRoutingModule } from "./pages.route";
import { RelatoriosComponent } from "./relatorios/relatorios.component";
import { NavbarComponent } from "../components/navbar/navbar.component";
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { RegisterUserAdministracaoComponent } from './control-administracao/register-user-administracao/register-user-administracao.component';
import { RegisterUserFornecedorComponent } from './control-fornecedor/register-user-fornecedor/register-user-fornecedor.component';
import { RegisterUserAssociacaoComponent } from './control-associacao/register-user-associacao/register-user-associacao.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { UpdateUserAdministracaoComponent } from './control-administracao/update-user-administracao/update-user-administracao.component';
import { UpdateUserAssociacaoComponent } from './control-associacao/update-user-associacao/update-user-associacao.component';
import { UpdateUserFornecedorComponent } from './control-fornecedor/update-user-fornecedor/update-user-fornecedor.component';
import { UserDataAdministracaoComponent } from './control-administracao/user-data-administracao/user-data-administracao.component';
import { UserDataAssociacaoComponent } from './control-associacao/user-data-associacao/user-data-associacao.component';
import { UserDataFornecedorComponent } from './control-fornecedor/user-data-fornecedor/user-data-fornecedor.component';
import { RegisterAssociationComponent } from './association/register-association/register-association.component';
import { UpdateAssociationComponent } from './association/update-association/update-association.component';
import { AssociationComponent } from './association/association.component';
import { DeleteAssociationComponent } from './association/delete-association/delete-association.component';
import { AssociationDataComponent } from './association/association-data/association-data.component';
import { CostItemsComponent } from './cost-items/cost-items.component';
import { RegisterCostItemsComponent } from './cost-items/register-cost-items/register-cost-items.component';
import { UpdateCostItemsComponent } from './cost-items/update-cost-items/update-cost-items.component';
import { DeleteCostItemsComponent } from './cost-items/delete-cost-items/delete-cost-items.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CostItemsDataComponent } from './cost-items/cost-items-data/cost-items-data.component';
import { ItemGroupComponent } from './item-group/item-group.component';
import { DadosConvenioComponent } from './convenios/dados-convenio/dados-convenio.component';
import { NewConvenioComponent } from './convenios/new-convenio/new-convenio.component';
import { EditConvenioComponent } from './convenios/edit-convenio/edit-convenio.component';
import { NewGroupComponent } from './item-group/new-group/new-group.component';
import { EditGroupComponent } from './item-group/edit-group/edit-group.component';
import { ProposalScreeningComponent } from './proposal-screening/proposal-screening.component';
import { RegisterSupplierComponent } from './fornecedor/register-supplier/register-supplier.component';
import { SupplierDataComponent } from './fornecedor/supplier-data/supplier-data.component';
import { DeleteFornecedorComponent } from './fornecedor/delete-fornecedor/delete-fornecedor.component';
import { UpdateFornecedorComponent } from './fornecedor/update-fornecedor/update-fornecedor.component';
import { ProfileComponent } from './profile/profile.component';
import { UpdateProfileComponent } from './profile/update-profile/update-profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ContractsComponent } from './contracts/contracts.component';
import { FracassarLicitacaoComponent } from './administration-licitacoes/administration-detail-licitacao/fracassar-licitacao/fracassar-licitacao.component';
import { CancelarLicitacaoComponent } from './administration-licitacoes/administration-detail-licitacao/cancelar-licitacao/cancelar-licitacao.component';
import { RecusarLicitacaoComponent } from './administration-licitacoes/administration-detail-licitacao/recusar-licitacao/recusar-licitacao.component';
import { AdministrationLicitacoesComponent } from './administration-licitacoes/administration-licitacoes.component';
import { AdministrationDetailLicitacaoComponent } from './administration-licitacoes/administration-detail-licitacao/administration-detail-licitacao.component';
import { AdministrationLoteLicitacaoComponent } from './administration-licitacoes/administration-lote-licitacao/administration-lote-licitacao.component';
import { AdministrationContractsLicitacaoComponent } from './administration-licitacoes/administration-contracts-licitacao/administration-contracts-licitacao.component';
import { FornecedorLicitacoesComponent } from './fornecedor-licitacoes/fornecedor-licitacoes.component';
import { FornecedorDetalheLicitacaoComponent } from './fornecedor-licitacoes/fornecedor-detalhe-licitacao/fornecedor-detalhe-licitacao.component';
import { AssociacaoRegisterLicitacaoComponent } from './associacao-register-licitacao/associacao-register-licitacao.component';
import { ProposalAcceptedComponent } from './proposal-screening/proposal-accepted/proposal-accepted.component';
import { ProposalSentComponent } from './proposal-screening/proposal-sent/proposal-sent.component';
import { AssociacaoLicitacaoDataComponent } from './associacao-licitacao-data/associacao-licitacao-data.component';
import { FornecedorContratoComponent } from './fornecedor-contrato/fornecedor-contrato.component';
import { FornecedorPropostaComponent } from './fornecedor-proposta/fornecedor-proposta.component';
import { FornecedorEnviarPropostaComponent } from './fornecedor-proposta/fornecedor-enviar-proposta/fornecedor-enviar-proposta.component';
import { FornecedorAtualizarPropostaComponent } from './fornecedor-proposta/fornecedor-atualizar-proposta/fornecedor-atualizar-proposta.component';
import { AssociacaoMapComponent } from './associacao-map/associacao-map.component';
import { FornecedorMapComponent } from './fornecedor-map/fornecedor-map.component';
import { FornecedorContratoSupplierComponent } from './fornecedor-contrato/fornecedor-contrato-supplier/fornecedor-contrato-supplier.component';
import { AssociacaoConveniosComponent } from './associacao-convenios/associacao-convenios.component';
import { AssociacaoConvenioDataComponent } from './associacao-convenio-data/associacao-convenio-data.component';
import { AssociacaoLicitacaoComponent } from './associacao-licitacao/associacao-licitacao.component';
import { AssociacaoContratosComponent } from './associacao-contratos/associacao-contratos.component';
import { AssociacaoContratosDataComponent } from './associacao-contratos-data/associacao-contratos-data.component';
import { AssociacaoLicitacaoViewProposalComponent } from './associacao-licitacao-view-proposal/associacao-licitacao-view-proposal.component';
import { AssociationBidService } from 'src/services/association-bid.service';
import { BidGetByIdResolve } from '../resolvers/get-bid-by-id.resolver';
import { ProdutosComponent } from './produtos/produtos.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { NewCategoriasComponent } from './categorias/new-categorias/new-categorias.component';
import { EditCategoriasComponent } from './categorias/edit-categorias/edit-categorias.component';
import { DeleteCategoriasComponent } from './categorias/delete-categorias/delete-categorias.component';
import { NewProdutoComponent } from './produtos/new-produto/new-produto.component';
import { EditProdutoComponent } from './produtos/edit-produto/edit-produto.component';
import { DeleteProdutoComponent } from './produtos/delete-produto/delete-produto.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CostItemGetByIdResolve } from '../resolvers/get-cost-item-by-ic.resolver';
import { CostItemsService } from 'src/services/cost-items.service';
import { DeleteConvenioComponent } from './convenios/delete-convenio/delete-convenio.component';

@NgModule({
    declarations: [
        PagesAppComponent,
        DashboardComponent,
        ControlAssociacaoComponent,
        ControlFornecedorComponent,
        ControlAdministracaoComponent,
        FornecedorComponent,
        ConveniosComponent,
        IntegracoesComponent,
        RelatoriosComponent,
        NavbarComponent,
        SidebarComponent,
        RegisterUserAdministracaoComponent,
        RegisterUserFornecedorComponent,
        RegisterUserAssociacaoComponent,
        DeleteUserComponent,
        UpdateUserAdministracaoComponent,
        UpdateUserAssociacaoComponent,
        UpdateUserFornecedorComponent,
        UserDataAdministracaoComponent,
        UserDataAssociacaoComponent,
        UserDataFornecedorComponent,
        RegisterAssociationComponent,
        RegisterSupplierComponent,
        SupplierDataComponent,
        UpdateAssociationComponent,
        AssociationComponent,
        DeleteAssociationComponent,
        DeleteFornecedorComponent,
        AssociationDataComponent,
        CostItemsComponent,
        RegisterCostItemsComponent,
        UpdateCostItemsComponent,
        DeleteCostItemsComponent,
        CostItemsDataComponent,
        ItemGroupComponent,
        DadosConvenioComponent,
        NewConvenioComponent,
        EditConvenioComponent,
        NewGroupComponent,
        EditGroupComponent,
        ProposalScreeningComponent,
        UpdateFornecedorComponent,
        ProfileComponent,
        UpdateProfileComponent,
        NotificationsComponent,
        ContractsComponent,
        FracassarLicitacaoComponent,
        CancelarLicitacaoComponent,
        RecusarLicitacaoComponent,
        ProposalAcceptedComponent,
        ProposalSentComponent,
        AdministrationLicitacoesComponent,
        AdministrationDetailLicitacaoComponent,
        AdministrationLoteLicitacaoComponent,
        AdministrationContractsLicitacaoComponent,
        FornecedorLicitacoesComponent,
        FornecedorDetalheLicitacaoComponent,
        AssociacaoRegisterLicitacaoComponent,
        ProposalAcceptedComponent,
        ProposalSentComponent,
        AssociacaoLicitacaoDataComponent,
        FornecedorContratoComponent,
        FornecedorPropostaComponent,
        FornecedorEnviarPropostaComponent,
        FornecedorAtualizarPropostaComponent,
        AssociacaoMapComponent,
        FornecedorMapComponent,
        FornecedorContratoSupplierComponent,
        AssociacaoConveniosComponent,
        AssociacaoConvenioDataComponent,
        AssociacaoLicitacaoComponent,
        AssociacaoContratosComponent,
        AssociacaoContratosDataComponent,
        AssociacaoLicitacaoViewProposalComponent,
        ProdutosComponent,
        CategoriasComponent,
        NewCategoriasComponent,
        EditCategoriasComponent,
        DeleteCategoriasComponent,
        NewProdutoComponent,
        EditProdutoComponent,
        DeleteProdutoComponent,
        DeleteConvenioComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        PagesRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        LeafletModule,
        LeafletDrawModule,
        NgxPaginationModule,
        Ng2SearchPipeModule,
        NgSelectModule,
        NgxMaskDirective,
        NgxMaskPipe,
        NgxSpinnerModule,
    ],
    providers: [
        AuthGuard,
        provideNgxMask(),
        AssociationBidService,
        BidGetByIdResolve,
        CostItemGetByIdResolve,
        CostItemsService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
})
export class PagesModule { }
