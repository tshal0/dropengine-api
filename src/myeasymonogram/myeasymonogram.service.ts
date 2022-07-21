import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as mysql2 from "mysql2/promise";
import * as appInsights from "applicationinsights";
import { NumberScalarMode } from "@nestjs/graphql";
import { MerchantProduct } from "./MerchantProduct";

export interface IMerchantProductDesignResponse {
  store_product_id: number;
  image_url: string;
}

interface MemDatabaseOptions {
  endpoint?: string;
  db?: string;
  username?: string;
  password?: string;
}

// Pull Designs, Design, Products with Designs embedded

@Injectable()
export class MyEasyMonogramService {
  private readonly logger: Logger = new Logger(MyEasyMonogramService.name);
  private pool: mysql2.Pool;
  private connection: mysql2.PoolConnection;
  private options: MemDatabaseOptions = {};
  constructor(private configService: ConfigService) {
    this.options.endpoint = this.configService.get<string>("MEM_DB_HOST");
    this.options.db = this.configService.get<string>("MEM_DB_NAME");
    this.options.username = this.configService.get<string>("MEM_DB_USER");
    this.options.password = this.configService.get<string>("MEM_DB_PASS");
    this.pool = mysql2.createPool({
      host: this.options.endpoint,
      user: this.options.username,
      password: this.options.password,
      database: this.options.db,
      pool: true,
    });
  }

  async queryDesigns() {
    return await appInsights.wrapWithCorrelationContext(async () => {
      try {
        this.connection = await this.pool.getConnection();
        const resp = await this.connection.execute(selectDesigns());
        const result: MerchantProduct[] = Object.values(resp[0][0])[0] as any;
        return result;
      } catch (err) {
        this.logger.error(err);
      } finally {
        this.logger.log(`[queryDesigns] Releasing connection`);
        this.connection.release();
      }
    })();
  }
  async getDesign(id: string) {
    return await appInsights.wrapWithCorrelationContext(async () => {
      try {
        this.connection = await this.pool.getConnection();
        const resp = await this.connection.execute(selectDesignObject(id));
        const result = Object.values(resp[0][0])[0];
        return result;
      } catch (err) {
        this.logger.error(err);
      } finally {
        this.logger.log(`[getDesign] Releasing connection`);
        this.connection.release();
      }
    })();
  }
}
export const selectDesigns = () => `
SELECT JSON_ARRAYAGG(
	JSON_OBJECT(
    'id', mrp.id,
    'title', mrp.title,
    'product_type', mrp.product_type,
    'store_product_id', mrp.store_product_id,
    'duplicate_unique_id', mrp.duplicate_unique_id,
    'store', (
      SELECT JSON_OBJECT(
        'email', usr.email,
        'name', usr.first_name
      ) FROM users AS usr WHERE usr.store_id = mrp.store_id
    ),
    'design_elements', (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'is_required', merchd.is_required,
          'is_master_required', merchd.is_master_required,
          'image_url', merchd.image_url,
          'is_deleted', merchd.is_deleted,
          'master_design', (
            SELECT JSON_OBJECT(
              'name', masd.name,
              'type', masd.type,
              'description', masd.description,
              'is_required', masd.is_required,
              'height', masd.height,
              'width', masd.width,
              'resolution', masd.resolution,
              'image_url', masd.image_url
            ) FROM master_design AS masd 
            WHERE masd.id = merchd.master_design_id
          )
        ) 
      ) FROM merchant_design AS merchd WHERE merchd.duplicate_unique_id = mrp.duplicate_unique_id
    ) 
  )
) FROM merchant_products AS mrp
WHERE mrp.duplicate_unique_id IS NOT NULL AND mrp.store_product_id IS NOT NULL`;

export const selectDesignObject = (id: string) => `
SELECT JSON_OBJECT(
    'id', mp.id,
    'app_store_id', mp.app_store_id,
    'store_id', mp.store_id,
    'master_product_id', mp.master_product_id,
    'store_product_id', mp.store_product_id,
    'title', mp.title,
    'description', mp.description,
    'customize_text', mp.customize_text,
    'category_name', mp.category_name,
    'product_type', mp.product_type,
    'tags', mp.tags,
    'is_available', mp.is_available,
    'is_deleted', mp.is_deleted,
    'duplicate_unique_id', mp.duplicate_unique_id,
    'variants', (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'sku', mpv.sku,
          'product_variant_id', mpv.master_variant_id,
          'stock', mpv.stock,
          'base_price', mpv.base_price,
          'extra_cost_price', CASE WHEN JSON_VALID(mpv.extra_cost_price) THEN JSON_EXTRACT(mpv.extra_cost_price, "$") ELSE null END,
          'price', mpv.price,
          'compared_at_price', mpv.compared_at_price,
          'manufacturing_time', mpv.manufacturing_time,
          'option_1', mpv.option_1,
          'option_value_1', mpv.option_value_1,
          'option_2', mpv.option_2,
          'option_value_2', mpv.option_value_2,
          'option_3', mpv.option_3,
          'option_value_3', mpv.option_value_3,
          'tags', mp.tags,
          'image', mpv.image,
          'weight', mpv.weight,
          'weight_unit', mpv.weight_unit,
          'width', mpv.width,
          'width_unit', mpv.width_unit,
          'height', mpv.height,
          'height_unit', mpv.height_unit,
          'is_visible', mpv.is_visible,
          'is_deleted', mpv.is_deleted
        )
      ) from master_products_variants AS mpv 
      WHERE mpv.master_product_id = mp.master_product_id
    ),
    'master_product', (
      SELECT JSON_OBJECT(
      'id', masp.id,
      'master_product_id', masp.master_product_id
      ) FROM master_products AS masp WHERE masp.master_product_id = mp.master_product_id
    ),
    'merchant_design', (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'duplicate_unique_id', merchd.duplicate_unique_id,
          'master_design_id', merchd.master_design_id,
          'master_design', (
            SELECT JSON_OBJECT(
            'id', masd.id,
            'name', masd.name,
            'type', masd.type,
            'training_url', masd.training_url,
            'description', masd.description,
            'is_required', masd.is_required,
            'height', masd.height,
            'width', masd.width,
            'resolution', masd.resolution,
            'image_url', masd.image_url,
            'master_product_id', masd.master_product_id
            ) FROM master_design AS masd WHERE masd.id = merchd.master_design_id
          ),
          'id', merchd.id,
          'is_required', merchd.is_required,
          'is_master_required', merchd.is_master_required,
          'image_url', merchd.image_url,
          'master_product_id', merchd.master_product_id,
          'app_store_id', merchd.app_store_id,
          'is_deleted', merchd.is_deleted,
          'personalization', (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                  'id', mdp.id,
                  'merchant_design_id', mdp.merchant_design_id,
                  'label', mdp.label,
                  'placeholder', mdp.placeholder,
                  'type', mdp.type,
                  'length', mdp.length,
                  'pattern', mdp.pattern,
                  'pattern_message', mdp.pattern_message,
                  'is_required', mdp.is_required,
                  'value', mdp.value
              )
            ) FROM merchant_design_personalization AS mdp WHERE mdp.merchant_design_id = merchd.id
          ) 
        ) 
      ) FROM merchant_design AS merchd WHERE merchd.duplicate_unique_id = mp.duplicate_unique_id
    )
  )
FROM merchant_products AS mp 
INNER JOIN master_products AS masp
ON masp.master_product_id = mp.master_product_id
WHERE mp.duplicate_unique_id IS NOT NULL AND masp.is_enable_duplicate = 'Y' AND mp.store_product_id = ${id}
`;
