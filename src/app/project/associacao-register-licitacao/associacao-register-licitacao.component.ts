import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AllotmentRequestDto, ItemRequestDto } from 'src/app/interface/licitacao.interface';
import { AssociationBidRequestDto } from 'src/dtos/association/association-bid.dto';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { UserTypeEnum } from 'src/enums/user-type.enum';
import { AssociationBidService } from 'src/services/association-bid.service';
import { ConvenioService } from 'src/services/convenio.service';
import { SupplierService } from 'src/services/supplier.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-associacao-register-licitacao',
  templateUrl: './associacao-register-licitacao.component.html',
  styleUrls: ['./associacao-register-licitacao.component.scss']
})
export class AssociacaoRegisterLicitacaoComponent {

  form!: FormGroup;
  formAddLots!: FormGroup;
  isSubmit: boolean = false;
  selectedFile: File | null = null;
  invitedSupplier: string[] = [];
  invitedSupplierId: string[] = [];
  supplierImg: string = '';
  selectedImageUrl: string;
  notImage = true;
  selectFile: any = [];
  totalFiles: File[] = [];
  lots: any[] = [];
  item: any[] = [];
  userList: any;
  // userList!: UserListResponseDto[];
  convenioList: any;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private associationBidService: AssociationBidService,
    private userService: UserService,
    private convenioService: ConvenioService,
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
        console.log(this.userList);

      },
      error: (err) => {
        console.error(err);
      }
    })

    // this.userService.listByType(UserTypeEnum.fornecedor).subscribe({
    //   next: (data) => {
    //     this.userList = data;
    //     console.log(this.userList);

    //   },
    //   error: (err) => {
    //     console.error(err);
    //   }
    // })

    this.convenioService.getConvenio().subscribe({
      next: (data) => {
        this.convenioList = data;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  generateRandomId() {
    const min = 1;
    const max = 100000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  onSubmit() {

    this.isSubmit = true;
    if (this.form.status == 'INVALID') {
      return;
    }

    let newBid: AssociationBidRequestDto;

    if (!this.lots || this.lots.length === 0) {
      newBid = {
        description: this.form.controls['description'].value,
        status: 'draft',
        agreement: this.form.controls['insurance'].value,
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
        status: 'awaiting',
        agreement: this.form.controls['insurance'].value,
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

    console.log(newBid);

    this.associationBidService.bidRegister(newBid).subscribe({
      next: (data) => {
        this.toastrService.success('Licitação criada com sucesso!', '', { progressBar: true, });
        this.router.navigate(['/pages/dashboard']);
      },
      error: (error) => {
        this.toastrService.error('Não foi possível criar a Licitação, verifique os campos', '', { progressBar: true, });
      }

    });

  }

  isFormValid(): boolean {
    const itemValid = this.formAddLots.controls['item'].valid;
    const quantityValid = this.formAddLots.controls['quantity'].valid;
    const isIndividualPrice = this.form.controls['biddingType'].value === 'individualPrice';
    const isOneItem = this.item.length === 1;

    return itemValid && quantityValid && !(isIndividualPrice && isOneItem);
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
      this.invitedSupplier.push(supplier);
    }

    const supplierId = this.formAddLots.controls['inviteSuppliers'].value;
    const selectedSupplier = this.userList.find((user: any) => user.name === supplierId);
    if (selectedSupplier && !this.invitedSupplier.includes(selectedSupplier._id)) {
      this.invitedSupplierId.push(selectedSupplier._id);
    }
  }

  removeSupplier(index: number) {
    this.invitedSupplier.splice(index, 1);
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
    const newItem: ItemRequestDto = {
      group: 'grupo',
      item: this.formAddLots.controls['item'].value,
      quantity: this.formAddLots.controls['quantity'].value,
    };

    this.item.push(newItem);
    this.formAddLots.controls['item'].reset();
    this.formAddLots.controls['quantity'].reset();
    this.formAddLots.markAsPristine();
  }

  addLot() {
    console.log(this.lots);

    if (this.item.length > 0) {
      const newAllotment: AllotmentRequestDto = {
        allotment_name: this.formAddLots.controls['batchName'].value,
        days_to_delivery: this.formAddLots.controls['deliveryTimeDays'].value,
        place_to_delivery: this.formAddLots.controls['deliveryPlaceLots'].value,
        quantity: this.formAddLots.controls['quantity'].value,
        files: this.supplierImg,
        add_item: [...this.item],
      };
      this.lots.push({ ...newAllotment });
      this.item = [];
      this.formAddLots.reset();
      this.supplierImg = '';
    } else {
      this.toastrService.error('É necessário adicionar pelo menos um item ao lote', '', { progressBar: true });
    }
    this.formAddLots.markAsPristine();
  }

  removeLot(index: number) {
    this.lots.splice(index, 1);
  }

  removeItem(index: number) {
    this.item.splice(index, 1);
  }
}
