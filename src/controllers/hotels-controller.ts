import httpStatus from "http-status";
import { Request, Response } from "express";
import hotelsService from "@/services/hotels-service";

export async function listHotels(req: Request, res: Response) {
  try {
    const hotels = await hotelsService.getHotels();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function listRoomsPerHotelById(req: Request, res: Response) {
  const { hotelId } = req.params;

  if (!hotelId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const rooms = await hotelsService.getRoomsPerHotelById(Number(hotelId));
    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
