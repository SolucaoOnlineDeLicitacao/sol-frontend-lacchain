import { Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { forkJoin } from "rxjs";
import { AllotmentRequestDto, ItemRequestDto } from "src/app/interface/licitacao.interface";
import { AssociationBidRequestDto } from "src/dtos/association/association-bid.dto";
import { CostItemsResponseDto } from "src/dtos/cost-items/cost-items-response.dto";
import { BidStatusEnum } from "src/enums/bid-status.enum";
import { AssociationBidService } from "src/services/association-bid.service";
import { ConvenioService } from "src/services/convenio.service";
import { CostItemsService } from "src/services/cost-items.service";
import { SupplierService } from "src/services/supplier.service";
import { UserService } from "src/services/user.service";

@Component({
  selector: "app-associacao-register-licitacao",
  templateUrl: "./associacao-register-licitacao.component.html",
  styleUrls: ["./associacao-register-licitacao.component.scss"],
})
export class AssociacaoRegisterLicitacaoComponent {
  @ViewChild('pdfLote') pdfFileLote: ElementRef;
  form!: FormGroup;
  formAddLots!: FormGroup;
  isSubmit: boolean = false;
  selectedFile: File | null = null;
  invitedSupplier: any[] = [];
  invitedSupplierId: any[] = [];
  supplierImg: string = "";
  selectedImageUrl: string;
  notImage = true;
  notEdital = true;
  notAta = true;
  selectFile: any = [];
  totalFiles: File[] = [];
  lots: any[] = [];
  item: any[] = [];
  userList: any;
  convenioList: any[];
  costItemsList: CostItemsResponseDto[];
  selectedEdital: any;
  selectedAta: any;
  checkBidType: string
  today: any

  date: string;
  classification: any[] = [];
  costItemsListFilter: any[] = [];

  storedLanguage: string | null

  selectedAdditionalFiles: any[] = [];

  daysToDeliveryValidator: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private associationBidService: AssociationBidService,
    private convenioService: ConvenioService,
    private supplierService: SupplierService,
    private ngxSpinnerService: NgxSpinnerService,
    private costItemsService: CostItemsService
  ) {
    this.form = this.formBuilder.group({
      description: ["", [Validators.required]],
      insurance: ["", [Validators.required]],
      classification: ["", [Validators.required]],
      initialDate: ["", [Validators.required]],
      closureDate: ["", [Validators.required]],
      timebreakerDays: ["", [Validators.required]],
      executionDays: ["", [Validators.required]],
      deliveryPlace: ["", [Validators.required]],
      biddingType: ["", [Validators.required]],
      modality: ["", [Validators.required]],
      adicionalSite: [""],
      editalFile: [""],
      ataFile: [""]
    });

    this.formAddLots = this.formBuilder.group({
      batchName: ["", [Validators.required]],
      deliveryTimeDays: ["", [Validators.required]],
      deliveryPlaceLots: ["", [Validators.required]],
      quantity: ["0"],
      item: [""],
      inviteSuppliers: [""],
    });
  }

  ngOnInit(): void {
    this.today = new Date()
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() + 10);
    this.date = currentDate.toISOString().slice(0, 10);

    const fork = forkJoin({
      costItens: this.costItemsService.list(),
      suppliers: this.supplierService.supplierList(),
      convenios: this.convenioService.getConvenio(),
    });

    fork.subscribe({
      next: data => {
        this.costItemsList = data.costItens;
        this.userList = data.suppliers;
        this.convenioList = data.convenios.filter((item: any) => !!item.association);

        if (localStorage.getItem("newBid")) {

          const newBid = JSON.parse(localStorage.getItem("newBid") || "{}");
          this.invitedSupplierId = newBid.invitedSupplierId;

          newBid.add_allotment.forEach((element: any) => {
            delete element['_id'];
          });

          this.lots = newBid.add_allotment;
          const executionDays = this.differenceInDays(newBid.days_to_delivery);

          this.form.patchValue({
            description: newBid.description,
            status: newBid.status || "awaiting",
            insurance: newBid.agreement._id,
            initialDate: newBid.start_at,
            closureDate: newBid.end_at,
            executionDays: executionDays,
            timebreakerDays: newBid.days_to_tiebreaker,
            deliveryPlace: newBid.local_to_delivery,
            biddingType: newBid.bid_type,
            modality: newBid.modality,
            adicionalSite: newBid.aditional_site,
            add_allotment: this.lots,
            invited_suppliers: this.invitedSupplierId,
          });

          this.changeAgreement();

          this.form.patchValue({
            classification: newBid.classification,
          });

          this.changeClassification();
        }
      },
      error: err => {
        console.error(err);
      }
    });

    this.storedLanguage = localStorage.getItem('selectedLanguage');

  }

  validationInput(event: any) {
    const valueInput = event?.target.value
    this.form.patchValue({
      executionDays: valueInput.replace(/[^0-9]/g, '')
    })
  }

  validationExecutionDays(event: any) {
    const valueInput = event?.target.value
    this.form.patchValue({
      timebreakerDays: valueInput.replace(/[^0-9]/g, '')
    })
  }

  validationDeliveryTimeDays(event: any) {
    const valueInput = event?.target.value
    this.formAddLots.patchValue({
      deliveryTimeDays: valueInput.replace(/[^0-9]/g, '')
    })
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

  ngOnDestroy(): void {
    localStorage.removeItem('newBid');
  }

  generateRandomId() {
    const min = 1;
    const max = 100000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.status == "INVALID") {

      let errorMessage = 'Preencha todos os campos obrigatórios!';

      switch (this.storedLanguage) {
        case 'pt':
          errorMessage = 'Preencha todos os campos obrigatórios!'
          break;
        case 'en':
          errorMessage = 'Fill in all required fields!'
          break;
        case 'fr':
          errorMessage = 'Remplissez tous les champs obligatoires !'
          break;
        case 'es':
          errorMessage = '¡Complete todos los campos requeridos!'
          break;
      }


      this.toastrService.error(errorMessage);
      return;
    }

    let newBid: AssociationBidRequestDto;

    if (!this.item || this.item.length === 0) {
      newBid = {
        description: this.form.controls["description"].value,
        status: BidStatusEnum.draft,
        agreementId: this.form.controls["insurance"].value,
        classification: this.form.controls["classification"].value,
        start_at: this.form.controls["initialDate"].value,
        end_at: this.form.controls["closureDate"].value,
        days_to_delivery: this.form.controls["executionDays"].value.toString(),
        days_to_tiebreaker: this.form.controls["timebreakerDays"].value.toString(),
        local_to_delivery: this.form.controls["deliveryPlace"].value,
        bid_type: this.form.controls["biddingType"].value,
        modality: this.form.controls["modality"].value,
        aditional_site: this.form.controls["adicionalSite"].value,
        add_allotment: this.lots,
        invited_suppliers: this.invitedSupplierId,
        editalFile: this.selectedEdital,
        ataFile: this.selectedAta || null,
      };
    } else {
      newBid = {
        description: this.form.controls["description"].value,
        status: BidStatusEnum.draft,
        agreementId: this.form.controls["insurance"].value,
        classification: this.form.controls["classification"].value,
        start_at: this.form.controls["initialDate"].value,
        end_at: this.form.controls["closureDate"].value,
        days_to_delivery: this.form.controls["executionDays"].value,
        days_to_tiebreaker: this.form.controls["timebreakerDays"].value,
        local_to_delivery: this.form.controls["deliveryPlace"].value,
        bid_type: this.form.controls["biddingType"].value,
        modality: this.form.controls["modality"].value,
        aditional_site: this.form.controls["adicionalSite"].value,
        add_allotment: this.lots,
        invited_suppliers: this.invitedSupplierId,
        editalFile: this.selectedEdital,
        ataFile: this.selectedAta || null,
      };
    }

    this.ngxSpinnerService.show();

    const formData = new FormData();

    this.selectedAdditionalFiles.forEach((file: any) => {
      formData.append('files', file);
    });

    formData.append('description', newBid.description!);
    formData.append('agreementId', newBid.agreementId!);
    formData.append('classification', newBid.classification!);
    formData.append('start_at', newBid.start_at!);
    formData.append('end_at', newBid.end_at!);
    formData.append('days_to_delivery', newBid.days_to_delivery!);
    formData.append('days_to_tiebreaker', newBid.days_to_tiebreaker!);
    formData.append('local_to_delivery', newBid.local_to_delivery!);
    formData.append('status', newBid.status!);
    formData.append('bid_type', newBid.bid_type!);
    formData.append('modality', newBid.modality!);
    formData.append('aditional_site', newBid.aditional_site!);

    if (newBid.invited_suppliers)
      for (let i = 0; i < newBid.invited_suppliers.length; i++)
        formData.append(`invited_suppliers[${i}][_id]`, newBid.invited_suppliers[i]!);

    if (newBid.add_allotment) {
      for (let i = 0; i < newBid.add_allotment.length; i++) {
        formData.append(`add_allotment[${i}][allotment_name]`, newBid.add_allotment[i].allotment_name!);
        formData.append(`add_allotment[${i}][days_to_delivery]`, newBid.add_allotment[i].days_to_delivery!);
        formData.append(`add_allotment[${i}][place_to_delivery]`, newBid.add_allotment[i].place_to_delivery!);
        formData.append(`add_allotment[${i}][quantity]`, newBid.add_allotment[i].quantity!);
        formData.append(`add_allotment[${i}][files]`, newBid.add_allotment[i].files!);

        for (let j = 0; j < newBid.add_allotment[i].add_item.length; j++) {
          formData.append(`add_allotment[${i}][add_item][${j}][group]`, newBid.add_allotment[i].add_item[j].group);
          formData.append(`add_allotment[${i}][add_item][${j}][item]`, newBid.add_allotment[i].add_item[j].item);
          formData.append(`add_allotment[${i}][add_item][${j}][quantity]`, newBid.add_allotment[i].add_item[j].quantity);
        }
      }
    }

    this.associationBidService.bidRegisterFormData(formData).subscribe({
      next: data => {

        let successMessage = 'Licitação criada com sucesso!';

        switch (this.storedLanguage) {
          case 'pt':
            successMessage = 'Licitação criada com sucesso!'
            break;
          case 'en':
            successMessage = 'Tender created successfully!'
            break;
          case 'fr':
            successMessage = "Appel d'offres créé avec succès !"
            break;
          case 'es':
            successMessage = '¡Oferta creada con éxito!'
            break;
        }

        this.toastrService.success(successMessage, "", { progressBar: true });
        this.ngxSpinnerService.hide();
        this.router.navigate(["/pages/associacao/licitacoes"]);
      },
      error: error => {

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

        this.toastrService.error(errorMessage, "", { progressBar: true });
        this.ngxSpinnerService.hide();
      },
    });
  }

  setModality(item: any) {
    this.checkBidType = item.value
  }

  isFormValid(): boolean {
    const itemValid = this.formAddLots.controls["item"].valid;
    const quantityValid = this.formAddLots.controls["quantity"].valid;
    const isIndividualPrice = this.form.controls["biddingType"].value === "individualPrice";
    const isOneItem = this.item?.length === 1;

    return itemValid && quantityValid && !(isIndividualPrice && isOneItem);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  selectSupplier(supplierId: string) {
    for (let iterator of this.userList) {
      if (iterator._id == supplierId) {
        return { _id: supplierId, name: iterator.name };
      }
    }

    return null;
  }

  addSupplier() {
    const supplierId = this.formAddLots.controls["inviteSuppliers"].value;
    const supplier = this.selectSupplier(supplierId);
    if (supplier && !this.invitedSupplierId.includes(supplierId)) {
      this.invitedSupplierId.push(supplierId);
      this.invitedSupplier.push(supplier);
    }
  }

  removeSupplier(index: number) {
    this.invitedSupplier.splice(index, 1);
    this.invitedSupplierId.splice(index, 1);
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

  onSelectFileEdital(event: any) {

    if (event.target.files && event.target.files[0]) {
      this.notEdital = false;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.selectedEdital = event.target.result as string;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onSelectFileAta(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.notAta = false;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.selectedAta = event.target.result as string;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onSelectAdditionalFiles(event: any) {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.selectedAdditionalFiles.push(event.target.files[i]);
      }
    }
  }

  addItem() {
    const selectedItem = this.costItemsList.find(item => item._id === this.formAddLots.controls["item"].value);

    if (selectedItem) {
      const newItem: ItemRequestDto = {
        group: "grupo",
        item: selectedItem.name || "",
        quantity: this.formAddLots.controls["quantity"].value,
      };
      this.item.push(newItem);
      this.formAddLots.controls["item"].reset()
      this.formAddLots.controls["quantity"].reset();
      this.formAddLots.markAsPristine();
    }
    // if (this.item.length > 0) {
    //   this.formAddLots.controls["batchName"].disable()
    //   this.formAddLots.controls["deliveryTimeDays"].disable()
    //   this.formAddLots.controls["deliveryPlaceLots"].disable()
    // }
  }

  getItemName(itemId: string): string {
    const item = this.costItemsList.find(item => item._id === itemId);
    return item && item.name ? item.name : "";
  }

  changeAgreement() {

    this.classification = [];

    this.form.patchValue({
      classification: ''
    });

    this.formAddLots.patchValue({
      item: ''
    });

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

  addLot() {
    if (this.item.length > 0) {
      const newAllotment: AllotmentRequestDto = {
        allotment_name: this.formAddLots.controls["batchName"].value,
        days_to_delivery: this.formAddLots.controls["deliveryTimeDays"].value,
        place_to_delivery: this.formAddLots.controls["deliveryPlaceLots"].value,
        quantity: this.formAddLots.controls["quantity"].value,
        files: this.supplierImg,
        add_item: [...this.item],
      };

      this.lots.push({ ...newAllotment });
      this.item = [];
      this.pdfFileLote.nativeElement.value = "";
      this.formAddLots.reset();
      this.supplierImg = "";

      console.log(newAllotment);


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

      this.toastrService.error(errorMessage, "", { progressBar: true });
    }
    this.formAddLots.markAsPristine();
  }

  getYear(event: any, formName: string) {

    const yearNow = new Date().getTime()
    const selectDate = new Date(event.target.value).getTime()


    if (formName === 'closureDate') {
      if (!this.form.controls['initialDate'].value) {
        this.form.controls['closureDate'].reset()
      }
    } else {
      this.form.controls['closureDate'].reset()

    }

  }

  removeLot(index: number) {
    this.lots.splice(index, 1);
  }

  checkValue(event: any) {
    if (event.target.value < 0) {
      event.target.value = 0;
    }
  }

  removeItem(index: number) {
    this.item.splice(index, 1);
    if (this.item.length === 0) {
      this.formAddLots.controls["batchName"].enable()
      this.formAddLots.controls["deliveryTimeDays"].enable()
      this.formAddLots.controls["deliveryPlaceLots"].enable()
    }
  }

  differenceInDays(date: string) {
    const splitedDate = date.split('-');
    const futureDate = new Date(+splitedDate[0], +splitedDate[1], +splitedDate[2]);;
    var now = new Date();
    let difference = futureDate.getTime() - now.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  }
}
