import httpStatus from "http-status";
import { Request, Response } from "express";
import hotelsService from "@/services/hotels-service";
import { AuthenticatedRequest } from "@/middlewares";

export async function listHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotels = await hotelsService.getHotels(Number(userId));

    if (hotels.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send([]);
    }

    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function listRoomsPerHotelById(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params;
  const { userId } = req;

  if (!hotelId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const rooms = await hotelsService.getRoomsPerHotelById(Number(hotelId), Number(userId));

    if (!rooms) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
