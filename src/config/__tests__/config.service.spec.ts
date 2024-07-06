import { Test } from '@nestjs/testing';
import { ConfigService as NestConfig } from '@nestjs/config';

import { configMocks } from './config.mocks';
import { ConfigService } from '../config.service';

describe('#ConfigService', () => {
  let service: ConfigService;
  let nestConfig: NestConfig;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ConfigService, NestConfig],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
    nestConfig = module.get<NestConfig>(NestConfig);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe.each(Object.keys(configMocks))('#%s', (name) => {
    const { varName, varType, varValue } = configMocks[name];

    it('should return the correct value.', () => {
      const getSpyOn = jest.spyOn(nestConfig, 'get').mockReturnValue(varValue);

      const result = service[name]();

      expect(result).toBeDefined();
      expect(result).toEqual(varValue);
      expect(typeof result).toEqual(varType);
      expect(getSpyOn).toHaveBeenCalledWith(varName);
    });

    it('should thrown an error if environment var is not setted.', () => {
      const getSpyOn = jest.spyOn(nestConfig, 'get').mockReturnValue(undefined);

      try {
        service[name]();
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.message).toContain(
          `No value setted for environment var '${varName}'.`,
        );
        expect(getSpyOn).toHaveBeenCalledWith(varName);
        return;
      }
      throw new Error();
    });
  });
});
