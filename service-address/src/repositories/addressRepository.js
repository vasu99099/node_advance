import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addressRepository = {
  async create(data) {
    return await prisma.address.create({ data });
  },

  async findById(id) {
    return await prisma.address.findUnique({ 
      where: { id, deletedAt: null } 
    });
  },

  async findByUserId(userId) {
    return await prisma.address.findMany({ 
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' }
    });
  },

  async update(id, data) {
    return await prisma.address.update({ where: { id }, data });
  },

  async delete(id) {
    return await prisma.address.update({ 
      where: { id }, 
      data: { deletedAt: new Date() } 
    });
  },

  async setDefault(userId, addressId) {
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId, isDefault: true, deletedAt: null },
        data: { isDefault: false }
      }),
      prisma.address.update({
        where: { id: addressId, deletedAt: null },
        data: { isDefault: true }
      })
    ]);
  }
};