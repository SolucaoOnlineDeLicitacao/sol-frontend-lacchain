import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { states, cities } from "estados-cidades";
import { Location } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { ConvenioService } from "src/services/convenio.service";
import { ConvenioRequestDto } from "src/dtos/convenio/convenio-request.dto";
import { AssociationService } from "src/services/association.service";
import { AssociationResponseDto } from "src/dtos/association/association-response.dto";
import { UserService } from "src/services/user.service";
import { UserListResponseDto } from "src/dtos/user/user-list-response.dto";
import { UserTypeEnum } from "src/enums/user-type.enum";
import { AgreementStatusEnum } from "src/enums/agreement-status.enum";

@Component({
  selector: "app-new-convenio",
  templateUrl: "./new-convenio.component.html",
  styleUrls: ["./new-convenio.component.scss"],
})
export class NewConvenioComponent {
  form: FormGroup;
  @ViewChild("number") number: ElementRef;
  @ViewChild("object") object: ElementRef;
  @ViewChild("city") city: ElementRef;
  @ViewChild("state") state: ElementRef;
  @ViewChild("price") price: ElementRef;
  @ViewChild("datesub") datesub: ElementRef;
  @ViewChild("datemat") datemat: ElementRef;
  @ViewChild("situation") situation: ElementRef;
  @ViewChild("association") association: ElementRef;
  @ViewChild("review") review: ElementRef;

  statesList: string[] = states();
  citiesList: string[] = [];
  request: ConvenioRequestDto;
  associationList: AssociationResponseDto[];
  userList: UserListResponseDto[];
  agreementStatusEnum = AgreementStatusEnum;
  numberalert = "Número";
  objectalert = "Objeto";
  statealert = "Estado";
  cityalert = "Município de execução do convênio";
  pricealert = "Valor do Convênio (R$)";
  datesubalert = "Data da assinatura";
  datematalert = "Data de vigência";
  situationalert = "Situação";
  associationalert = "Associação";
  reviewalert = "Revisor";
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: FormBuilder,
    private associationService: AssociationService,
    private convenioService: ConvenioService,
    private userService: UserService,
    private location: Location,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      number: ["", [Validators.required]],
      object: ["", [Validators.required]],
      price: ["", [Validators.required]],
      state: ["", [Validators.required]],
      city: ["", [Validators.required]],
      datesub: ["", [Validators.required, Validators.minLength(8)]],
      datemat: ["", [Validators.required, Validators.minLength(8)]],
      situation: ["", [Validators.required]],
      association: ["", [Validators.required]],
      review: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getAssociation();
    this.getAdm();
  }

  getAssociation() {
    this.associationService.list().subscribe({
      next: success => {
        this.associationList = success;
      },
      error: error => {
        console.error(error);
      },
    });
  }

  getAdm() {
    this.userService.listByType(UserTypeEnum.administrador).subscribe({
      next: data => {
        this.userList = data;
      },
      error: err => {
        console.error(err);
      },
    });
  }

  verifyInputs() {
    if (
      this.form.controls["number"].value === undefined ||
      this.form.controls["number"].value === "" ||
      this.form.controls["number"].value === null
    ) {
      this.number.nativeElement.classList.add("border-danger", "border", "text-danger");
      this.numberalert = "Número necessário";
      setInterval(() => {
        this.number.nativeElement.classList.remove("border-danger", "border", "text-danger");
        this.numberalert = "Número";
      }, 2000);
    } else if (
      this.form.controls["object"].value === undefined ||
      this.form.controls["object"].value === "" ||
      this.form.controls["object"].value === null
    ) {
      this.object.nativeElement.classList.add("border-danger", "border", "text-danger");
      this.objectalert = "Objeto não informado";
      setInterval(() => {
        this.object.nativeElement.classList.remove("border-danger", "border", "text-danger");
        this.objectalert = "Objeto";
      }, 2000);
    } else if (
      this.form.controls["state"].value === undefined ||
      this.form.controls["state"].value === "" ||
      this.form.controls["state"].value === null
    ) {
      this.state.nativeElement.classList.add("border-danger", "border", "text-danger");
      this.statealert = "Estado não informado";
      setInterval(() => {
        this.state.nativeElement.classList.remove("border-danger", "border", "text-danger");
        this.statealert = "Estado";
      }, 2000);
    } else if (
      this.form.controls["city"].value === undefined ||
      this.form.controls["city"].value === "" ||
      this.form.controls["city"].value === null
    ) {
      this.city.nativeElement.classList.add("border-danger", "border", "text-danger");
      this.cityalert = "Município de execução do convênio não informado";
      setInterval(() => {
        this.city.nativeElement.classList.remove("border-danger", "border", "text-danger");
        this.cityalert = "Município de execução do convênio";
      }, 2000);
    } else if (
      this.form.controls["price"].value === undefined ||
      this.form.controls["price"].value === "" ||
      this.form.controls["price"].value === null
    ) {
      this.price.nativeElement.classList.add("border-danger", "border", "text-danger");
      this.pricealert = "Valor do Convênio não informado";
      setInterval(() => {
        this.price.nativeElement.classList.remove("border-danger", "border", "text-danger");
        this.pricealert = "Valor do Convênio (R$)";
      }, 2000);
    } else if (
      this.form.controls["datesub"].value === undefined ||
      this.form.controls["datesub"].value === "" ||
      this.form.controls["datesub"].value === null
    ) {
      this.datesub.nativeElement.classList.add("border-danger", "border", "text-danger");
      this.datesubalert = "Data da assinatura não informada";
      setInterval(() => {
        this.datesub.nativeElement.classList.remove("border-danger", "border", "text-danger");
        this.datesubalert = "Data da assinatura";
      }, 2000);
    } else if (
      this.form.controls["datemat"].value === undefined ||
      this.form.controls["datemat"].value === "" ||
      this.form.controls["datemat"].value === null
    ) {
      this.datemat.nativeElement.classList.add("border-danger", "border", "text-danger");
      this.datematalert = "Data de vigência não informada";
      setInterval(() => {
        this.datemat.nativeElement.classList.remove("border-danger", "border", "text-danger");
        this.datematalert = "Data de vigência";
      }, 2000);
    } else if (
      this.form.controls["situation"].value === undefined ||
      this.form.controls["situation"].value === "" ||
      this.form.controls["situation"].value === null
    ) {
      this.situation.nativeElement.classList.add("border-danger", "border", "text-danger");
      this.situationalert = "Situação não informada";
      setInterval(() => {
        this.situation.nativeElement.classList.remove("border-danger", "border", "text-danger");
        this.situationalert = "Situação";
      }, 2000);
    } else if (
      this.form.controls["association"].value === undefined ||
      this.form.controls["association"].value === "" ||
      this.form.controls["association"].value === null
    ) {
      this.association.nativeElement.classList.add("border-danger", "border", "text-danger");
      this.associationalert = "Associação não informada";
      setInterval(() => {
        this.association.nativeElement.classList.remove("border-danger", "border", "text-danger");
        this.associationalert = "Associação";
      }, 2000);
    } else if (
      this.form.controls["review"].value === undefined ||
      this.form.controls["review"].value === "" ||
      this.form.controls["review"].value === null
    ) {
      this.review.nativeElement.classList.add("border-danger", "border", "text-danger");
      this.reviewalert = "Revisor não informado";
      setInterval(() => {
        this.review.nativeElement.classList.remove("border-danger", "border", "text-danger");
        this.reviewalert = "Revisor";
      }, 2000);
    }
  }

  backConvenio() {
    this.location.back();
  }

  onSubmit() {
    this.verifyInputs();
    if (this.form.invalid) {
      return;
    }

    this.request = {
      register_number: `${this.form.controls["number"].value}/${this.year} `,
      register_object: this.form.controls["object"].value,
      states: this.form.controls["state"].value,
      city: this.form.controls["city"].value,
      value: +this.form.controls["price"].value,
      signature_date: new Date(
        `${this.form.controls["datesub"].value.substring(2, 4)}/${this.form.controls["datesub"].value.substring(
          0,
          2
        )}/${this.form.controls["datesub"].value.substring(4, 8)}`
      ),
      validity_date: new Date(
        `${this.form.controls["datemat"].value.substring(2, 4)}/${this.form.controls["datemat"].value.substring(
          0,
          2
        )}/${this.form.controls["datemat"].value.substring(4, 8)}`
      ),
      status: this.form.controls["situation"].value,
      associationId: this.form.controls["association"].value,
      reviewerId: this.form.controls["review"].value,
    };

    if (this.form.valid) {
      this.convenioService.register(this.request).subscribe({
        next: success => {
          this.toastrService.success("Criado com sucesso!", "", { progressBar: true });
          this.location.back();
        },
        error: error => {
          console.error(error);
          this.toastrService.error(error.error.errors[0], "Error ao criar!", { progressBar: true });
        },
      });
    }
  }

  getCity(state: string) {
    this.citiesList = cities(state) || [];
  }
}
