import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AllotmentRequestDto, ItemRequestDto } from 'src/app/interface/licitacao.interface';
import { AssociationBidRequestDto } from 'src/dtos/association/association-bid.dto';
import { ConvenioResponseDto } from 'src/dtos/convenio/convenio-response.dto';
import { CostItemsResponseDto } from 'src/dtos/cost-items/cost-items-response.dto';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { BidStatusEnum } from 'src/enums/bid-status.enum';
import { UserTypeEnum } from 'src/enums/user-type.enum';
import { AssociationBidService } from 'src/services/association-bid.service';
import { ConvenioService } from 'src/services/convenio.service';
import { CostItemsService } from 'src/services/cost-items.service';
import { SupplierService } from 'src/services/supplier.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-associacao-edit-licitacao',
  templateUrl: './associacao-edit-licitacao.component.html',
  styleUrls: ['./associacao-edit-licitacao.component.scss']
})
export class AssociacaoEditLicitacaoComponent {

  form!: FormGroup;
  formAddLots!: FormGroup;
  isSubmit: boolean = false;
  selectedFile: File | null = null;
  invitedSupplier: any = [];
  invitedSupplierId: string[] = [];
  supplierImg: string = '';
  selectedImageUrl: string;
  notImage = true;
  selectFile: any = [];
  totalFiles: File[] = [];
  lots: any[] = [];
  item: any[] = [];
  // userList!: UserListResponseDto[];
  userList: any;
  licitacaoId: any;
  convenioList: ConvenioResponseDto[];
  costItemsList: CostItemsResponseDto[];

  classification: any[] = [];
  costItemsListFilter: any[] = [];
  storedLanguage: string | null;

  daysToDeliveryValidator: boolean = false;

  disableEditLot = false

  lotToEdit: any
  lotNumber: number

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private associationBidService: AssociationBidService,
    private convenioService: ConvenioService,
    private route: ActivatedRoute,
    private costItemsService: CostItemsService,
    private supplierService: SupplierService
  ) {
    this.form = this.formBuilder.group({
      description: ['', [Validators.required]],
      insurance: ['', [Validators.required]],
      classification: ['', [Validators.required]],
      initialDate: ['', [Validators.required]],
      closureDate: ['', [Validators.required]],
      timebreakerDays: ['', [Validators.required]],
      executionDays: ['', [Validators.required]],
      deliveryPlace: ['', [Validators.required]],
      biddingType: ['', [Validators.required]],
      modality: ['', [Validators.required]],
      adicionalSite: ['']
    });

    this.formAddLots = this.formBuilder.group({
      batchName: ['', [Validators.required]],
      deliveryTimeDays: ['', [Validators.required]],
      deliveryPlaceLots: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      item: [''],
      inviteSuppliers: [''],
    });
  }

  ngOnInit(): void {

    this.supplierService.supplierList().subscribe({
      next: (data) => {
        this.userList = data;
      },
      error: (err) => {
        console.error(err);
      }
    })

    this.licitacaoId = this.route.snapshot.paramMap.get('_id');

    if (this.licitacaoId) {
      this.associationBidService.getById(this.licitacaoId).subscribe({
        next: (data: any) => {

          this.invitedSupplier = data.invited_suppliers;

          this.invitedSupplierId = data.invited_suppliers.map((objeto: any) => objeto._id);

          const bidData: any = data;
          this.lots = bidData.add_allotment;
          this.form.patchValue({
            description: bidData.description,
            status: bidData.status || 'awaiting',
            insurance: bidData.agreement._id,
            classification: bidData.classification,
            initialDate: bidData.start_at,
            closureDate: bidData.end_at,
            executionDays: bidData.days_to_delivery,
            timebreakerDays: bidData.days_to_tiebreaker,
            deliveryPlace: bidData.local_to_delivery,
            biddingType: bidData.bid_type,
            modality: bidData.modality,
            adicionalSite: bidData.aditional_site,
            add_allotment: this.lots,
            invited_suppliers: this.invitedSupplierId,
          });
          this.convenioService.getConvenio().subscribe({
            next: (data) => {
              this.convenioList = data.filter((item: any) => !!item.association);
              this.changeAgreement();
              this.form.patchValue({
                classification: bidData.classification,
              });
              this.changeClassification();
            },
            error: (err) => {
              console.error(err);
            }
          })


        },
        error: (error) => {
          let errorMessage = 'Não foi possível criar a Licitação, verifique os campos';

          switch (this.storedLanguage) {
            case 'pt':
              errorMessage = 'Não foi possível criar a Licitação, verifique os campos'
              break;
            case 'en':
              errorMessage = 'Unable to create the Tender, check the fields'
              break;
            case 'fr':
              errorMessage = "Impossible de créer l'offre, vérifiez les champs"
              break;
            case 'es':
              errorMessage = 'No se pudo crear la Oferta, verifique los campos'
              break;
          }

          this.toastrService.error(errorMessage, '', { progressBar: true });
        }
      });
    } else {
      let errorMessage = 'Não foi possível encontrar um ID válido para essa licitação';

      switch (this.storedLanguage) {
        case 'pt':
          errorMessage = 'Não foi possível encontrar um ID válido para essa licitação'
          break;
        case 'en':
          errorMessage = 'Could not find a valid ID for this bid'
          break;
        case 'fr':
          errorMessage = "Impossible de trouver un ID valide pour cette enchère"
          break;
        case 'es':
          errorMessage = 'No se pudo encontrar una identificación válida para esta oferta'
          break;
      }

      this.toastrService.error(errorMessage, '', { progressBar: true });
    }

    this.costItemsService.list().subscribe({
      next: success => {
        this.costItemsList = success;
      },
      error: error => {
        console.error(error);
      },
    });

    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }

  changeAgreement() {
    this.classification = [];
    let convenioIndex = this.convenioList.findIndex((el: any) => el._id == this.form.controls['insurance'].value);
    for (const workPlan of this.convenioList[convenioIndex].workPlan) {
      const categorys = workPlan.product.map((a: any) => a.costItems?.category?.category_name);
      for (const category of categorys) {
        if (!this.classification.includes(category)) {
          this.classification.push(category);
        }
      }
    }
    this.costItemsList = [];
    for (const workPlan of this.convenioList[convenioIndex].workPlan) {
      const costItems = workPlan.product.map((a: any) => a.costItems);
      for (const item of costItems) {
        this.costItemsList.push(item);
      }
    }
  }

  changeClassification() {
    this.costItemsListFilter = [];
    this.costItemsListFilter = this.costItemsList.filter((a: any) => a.category?.category_name == this.form.controls['classification'].value);
    for (const costItem of this.costItemsList) {
      if (costItem?.category?.category_name == this.form.controls['insurance'].value) {
        this.costItemsListFilter.push(costItem);
      }
    }
  }

  generateRandomId() {
    const min = 1;
    const max = 100000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  validateDaysInput() {
    const executionDaysValue = parseInt(this.form.controls["executionDays"].value);
    const deliveryTimeDaysValue = parseInt(this.formAddLots.controls["deliveryTimeDays"].value);

    if (deliveryTimeDaysValue > executionDaysValue) {
      this.daysToDeliveryValidator = true;
    } else {
      this.daysToDeliveryValidator = false;
    }
  }

  onSubmit() {

    this.isSubmit = true;
    if (this.form.status == 'INVALID') {

      let errorMessage = 'Preencha todos os campos obrigatórios';

      switch (this.storedLanguage) {
        case 'pt':
          errorMessage = 'Preencha todos os campos obrigatórios'
          break;
        case 'en':
          errorMessage = 'Fill in all required fields'
          break;
        case 'fr':
          errorMessage = "Remplissez tous les champs obligatoires"
          break;
        case 'es':
          errorMessage = 'Rellene todos los campos obligatorios'
          break;
      }

      this.toastrService.error(errorMessage);
      return;
    }

    let newBid: AssociationBidRequestDto;

    if (!this.lots || this.lots.length === 0) {
      newBid = {
        description: this.form.controls['description'].value,
        status: BidStatusEnum.draft,
        agreementId: this.form.controls['insurance'].value,
        classification: this.form.controls['classification'].value,
        start_at: this.form.controls['initialDate'].value,
        end_at: this.form.controls['closureDate'].value,
        days_to_delivery: this.form.controls['executionDays'].value,
        days_to_tiebreaker: this.form.controls['timebreakerDays'].value,
        local_to_delivery: this.form.controls['deliveryPlace'].value,
        bid_type: this.form.controls['biddingType'].value,
        modality: this.form.controls['modality'].value,
        aditional_site: this.form.controls['adicionalSite'].value,
        add_allotment: this.lots,
        invited_suppliers: this.invitedSupplierId,
      };
    } else {
      newBid = {
        description: this.form.controls['description'].value,
        status: BidStatusEnum.draft,
        agreementId: this.form.controls['insurance'].value,
        classification: this.form.controls['classification'].value,
        start_at: this.form.controls['initialDate'].value,
        end_at: this.form.controls['closureDate'].value,
        days_to_delivery: this.form.controls['executionDays'].value,
        days_to_tiebreaker: this.form.controls['timebreakerDays'].value,
        local_to_delivery: this.form.controls['deliveryPlace'].value,
        bid_type: this.form.controls['biddingType'].value,
        modality: this.form.controls['modality'].value,
        aditional_site: this.form.controls['adicionalSite'].value,
        add_allotment: this.lots,
        invited_suppliers: this.invitedSupplierId,
      };
    }

    this.associationBidService.updateBid(this.licitacaoId, newBid).subscribe({
      next: (data) => {
        let successMessage = 'Licitação editada com sucesso!';

        switch (this.storedLanguage) {
          case 'pt':
            successMessage = 'Licitação editada com sucesso!'
            break;
          case 'en':
            successMessage = 'Bid edited successfully!'
            break;
          case 'fr':
            successMessage = 'Enchère modifiée avec succès !'
            break;
          case 'es':
            successMessage = '¡Oferta editada con éxito!'
            break;
        }

        this.toastrService.success(successMessage, '', { progressBar: true, });
        this.router.navigate(['/pages/dashboard']);
      },
      error: (error) => {
        let errorMessage = 'Não foi possível editar a Licitação, verifique os campos';

        switch (this.storedLanguage) {
          case 'pt':
            errorMessage = 'Não foi possível editar a Licitação, verifique os campos'
            break;
          case 'en':
            errorMessage = 'Unable to edit Bid, check fields'
            break;
          case 'fr':
            errorMessage = "Impossible de modifier l'enchère, vérifiez les champs"
            break;
          case 'es':
            errorMessage = 'No se puede editar la oferta, verifique los campos'
            break;
        }

        this.toastrService.error(errorMessage, '', { progressBar: true, });
      }

    });

  }

  isFormValid(): boolean {
    return this.formAddLots.controls['item'].valid && this.formAddLots.controls['quantity'].valid;
  }

  isLotFormValid(): boolean {
    const isFormValid =
      this.formAddLots.controls['batchName'].valid &&
      this.formAddLots.controls['deliveryTimeDays'].valid &&
      this.formAddLots.controls['deliveryPlaceLots'].valid;

    const hasFile = this.supplierImg !== '';

    return isFormValid && hasFile;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  selectSupplier(supplier: string) {
    this.formAddLots.controls['inviteSuppliers'].setValue(supplier);
  }

  addSupplier() {
    const supplier = this.formAddLots.controls['inviteSuppliers'].value;
    if (supplier.trim() !== '' && !this.invitedSupplier.includes(supplier)) {
      this.invitedSupplier.push({ name: supplier });
    }

    const supplierId = this.formAddLots.controls['inviteSuppliers'].value;
    const selectedSupplier = this.userList.find((user: any) => user.name === supplierId);
    if (selectedSupplier && !this.invitedSupplier.includes(selectedSupplier._id)) {
      this.invitedSupplierId.push(selectedSupplier._id);
    }
  }

  removeSupplier(index: number) {
    this.invitedSupplier.splice(index, 1);
    this.invitedSupplierId.splice(index, 1)
  }

  onSelectFileProductImage(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.totalFiles.push(event.target.files[i]);
    }

    if (event.target.files && event.target.files[0]) {
      this.notImage = false;
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.supplierImg = event.target.result as string;
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  addItem() {
    const selectedItem = this.costItemsList.find(item => item._id === this.formAddLots.controls["item"].value);
    const newItem: ItemRequestDto = {
      group: 'grupo',
      item: this.formAddLots.controls['item'].value,
      quantity: this.formAddLots.controls['quantity'].value,
      unitMeasure: selectedItem?.unitMeasure || "",
      specification: selectedItem.specification
    };

    this.item.push(newItem);
    this.formAddLots.controls['item'].reset();
    this.formAddLots.controls['quantity'].reset();
  }

  addLot() {
    if (this.item.length > 0) {
      const newAllotment: AllotmentRequestDto = {
        allotment_name: this.formAddLots.controls['batchName'].value,
        days_to_delivery: this.formAddLots.controls['deliveryTimeDays'].value,
        place_to_delivery: this.formAddLots.controls['deliveryPlaceLots'].value,
        quantity: this.formAddLots.controls['quantity'].value,
        files: this.supplierImg,
        add_item: [...this.item]
      };
      this.lots.push(newAllotment);
      this.item = [];
      this.formAddLots.reset();
      this.supplierImg = '';
    } else {
      let errorMessage = 'É necessário adicionar pelo menos um item ao lote';

      switch (this.storedLanguage) {
        case 'pt':
          errorMessage = 'É necessário adicionar pelo menos um item ao lote'
          break;
        case 'en':
          errorMessage = 'You must add at least one item to the batch'
          break;
        case 'fr':
          errorMessage = "Vous devez ajouter au moins un article au lot"
          break;
        case 'es':
          errorMessage = 'Debe agregar al menos un artículo al lote'
          break;
      }

      this.toastrService.error(errorMessage, '', { progressBar: true });
    }
  }
  editAllotment(event: any) {
    switch (event.target.id) {
      case 'batchName':
        this.lots[this.lotNumber].allotment_name = event.target.value;

        break
      case 'deliveryTimeDays':
        this.lots[this.lotNumber].days_to_delivery = event.target.value
        break
      case 'deliveryPlaceLots':
        this.lots[this.lotNumber].place_to_delivery = event.target.value
        break
      default:
    }

  }

  addAllotmentItem(item: any) {
    const selectedItem = this.costItemsList.find(item => item._id === this.formAddLots.controls["item"].value);
    if (selectedItem) {
      const newItem: ItemRequestDto = {
        group: "grupo",
        item: selectedItem.name || "",
        quantity: this.formAddLots.controls["quantity"].value,
        unitMeasure: selectedItem.unitMeasure || "",
        specification: selectedItem.specification
      };
      this.lots[this.lotNumber].add_item.push(newItem);
      // this.formAddLots.controls["item"].reset()
      // this.formAddLots.controls["quantity"].reset();
      // this.formAddLots.markAsPristine();

    }
  }

  saveChanges() {
    this.disableEditLot = !this.disableEditLot

    this.lots[this.lotNumber].files = this.supplierImg
  }

  onSelectFileAllotment(event: any) {

    for (let i = 0; i < event.target.files.length; i++) {
      this.totalFiles.push(event.target.files[i]);
    }

    if (event.target.files && event.target.files[0]) {
      this.notImage = false;
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.supplierImg = event.target.result as string;

        };
        reader.readAsDataURL(event.target.files[i]);

      }
    }

  }

  removeAllotmentItem(index: number) {

    this.lots[this.lotNumber].add_item.splice(index, 1)


  }

  editLot(index: number) {

    this.lotNumber = index
    this.disableEditLot = !this.disableEditLot
    this.lotToEdit = this.lots[index]




  }

  removeLot(index: number) {
    this.lots.splice(index, 1);
  }

  removeItem(index: number) {
    this.item.splice(index, 1);
  }
}
