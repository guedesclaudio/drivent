export type ApplicationError = {
  name: string;
  message: string;
};

export type ViaCEPAddress = {
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,

};

export type AddressEnrollment = {
  logradouro: string,
  complemento: string,
  bairro: string,
  cidade: string,
  uf: string,
  error?: string

}

export type RequestError = {
  status: number,
  data: object | null,
  statusText: string,
  name: string,
  message: string,
};

export type PaymentProcess = {
  ticketId: number,
  cardData: {
    issuer: string,
    number: string,
    name: string,
    expirationDate: Date,
    cvv: number
  }
}

export type ReadBooking = {
  id: number,
  Room: {
    id: number,
    capacity: number,
    hotelId: number,
    name: number,
    createdAt: Date,
    updatedAt: Date,
  }
}
