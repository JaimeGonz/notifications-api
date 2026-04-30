import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './notifications.repository';
import { NotificationChannelFactory } from './notification-channel.factory';
import { NotFoundException } from '@nestjs/common';

const mockNotification = {
  id: 1,
  title: 'Test notification',
  content: 'Test content',
  channel: 'email',
  userId: 1,
  createdAt: new Date(),
};

const mockRepository = {
  create: jest.fn(),
  findAllByUser: jest.fn(),
  findOneByUser: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockChannel = {
  send: jest.fn(),
};

const mockChannelFactory = {
  getChannel: jest.fn().mockReturnValue(mockChannel),
};

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: NotificationsRepository, useValue: mockRepository },
        { provide: NotificationChannelFactory, useValue: mockChannelFactory },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a notification and call the correct channel', async () => {
      mockRepository.create.mockResolvedValue(mockNotification);

      const dto = { title: 'Test', content: 'Content', channel: 'email' };
      const result = await service.create(dto, 1);

      expect(mockRepository.create).toHaveBeenCalledWith(dto, 1);
      expect(mockChannelFactory.getChannel).toHaveBeenCalledWith('email');
      expect(mockChannel.send).toHaveBeenCalledWith({
        title: mockNotification.title,
        content: mockNotification.content,
        userId: mockNotification.userId,
      });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('findAll', () => {
    it('should return all notifications for a user', async () => {
      mockRepository.findAllByUser.mockResolvedValue([mockNotification]);

      const result = await service.findAll(1);

      expect(mockRepository.findAllByUser).toHaveBeenCalledWith(1);
      expect(result).toEqual([mockNotification]);
    });
  });

  describe('findOne', () => {
    it('should return a notification if it exists', async () => {
      mockRepository.findOneByUser.mockResolvedValue(mockNotification);

      const result = await service.findOne(1, 1);

      expect(mockRepository.findOneByUser).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockNotification);
    });

    it('should throw NotFoundException if notification does not exist', async () => {
      mockRepository.findOneByUser.mockRejectedValue(
        new NotFoundException('Notificación 99 no encontrada'),
      );

      await expect(service.findOne(99, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a notification', async () => {
      const updatedNotification = { ...mockNotification, title: 'Updated' };
      mockRepository.findOneByUser.mockResolvedValue(mockNotification);
      mockRepository.update.mockResolvedValue(updatedNotification);

      const result = await service.update(1, 1, { title: 'Updated' });

      expect(mockRepository.findOneByUser).toHaveBeenCalledWith(1, 1);
      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        title: 'Updated',
      });
      expect(result).toEqual(updatedNotification);
    });
  });

  describe('remove', () => {
    it('should remove a notification', async () => {
      mockRepository.findOneByUser.mockResolvedValue(mockNotification);
      mockRepository.remove.mockResolvedValue(mockNotification);

      const result = await service.remove(1, 1);

      expect(mockRepository.findOneByUser).toHaveBeenCalledWith(1, 1);
      expect(mockRepository.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNotification);
    });
  });
});
