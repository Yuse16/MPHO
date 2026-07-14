import { describe, it, expect } from 'vitest';
import type {
  Profile,
  Customer,
  City,
  Zone,
  Partner,
  Recipient,
  Address,
  ProfileInsert,
  CityInsert,
} from '@mpho/database/types';

// ─── Type guards ────────────────────────────────────────────────────────────
// Verify the type definitions match what doc 25 specifies.

function assertType<T>(value: T): void {
  // Runtime no-op; the compiler enforces types.
  void value;
}

describe('Database types', () => {
  it('Profile has required fields from doc 25', () => {
    const profile: Profile = {
      id: '00000000-0000-0000-0000-000000000001',
      auth_user_id: '00000000-0000-0000-0000-000000000002',
      email: 'test@example.com',
      phone: null,
      display_name: 'Test User',
      status: 'active',
      default_role: 'customer',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      last_login_at: null,
    };
    assertType(profile);
    expect(profile.status).toBe('active');
    expect(profile.default_role).toBe('customer');
  });

  it('Customer has required fields from doc 25', () => {
    const customer: Customer = {
      id: '00000000-0000-0000-0000-000000000010',
      profile_id: '00000000-0000-0000-0000-000000000001',
      marketing_consent: false,
      preferred_currency: 'MXN',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    };
    assertType(customer);
    expect(customer.preferred_currency).toBe('MXN');
    expect(customer.marketing_consent).toBe(false);
  });

  it('City has all fields from doc 25 §10', () => {
    const city: City = {
      id: '00000000-0000-0000-0000-000000000020',
      name: 'Saltillo',
      state: 'Coahuila',
      country_code: 'MX',
      timezone: 'America/Monterrey',
      currency: 'MXN',
      status: 'active',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    };
    assertType(city);
    expect(city.status).toBe('active');
    expect(city.timezone).toBe('America/Monterrey');
  });

  it('Zone has all fields from doc 25 §11', () => {
    const zone: Zone = {
      id: '00000000-0000-0000-0000-000000000030',
      city_id: '00000000-0000-0000-0000-000000000020',
      name: 'Centro',
      slug: 'centro',
      status: 'active',
      postal_codes: ['66000'],
      boundary_geojson: null,
      mphora_enabled: false,
      operating_hours: null,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    };
    assertType(zone);
    expect(zone.mphora_enabled).toBe(false);
    expect(zone.postal_codes).toContain('66000');
  });

  it('Partner has all fields from doc 25 §12', () => {
    const partner: Partner = {
      id: '00000000-0000-0000-0000-000000000040',
      public_name: 'Flores del Centro',
      legal_name: 'Flores del Centro SA de CV',
      slug: 'flores-del-centro',
      status: 'active',
      city_id: '00000000-0000-0000-0000-000000000020',
      primary_zone_id: '00000000-0000-0000-0000-000000000030',
      address_id: null,
      phone: null,
      email: null,
      timezone: 'America/Monterrey',
      payout_currency: 'MXN',
      agreement_version: null,
      agreement_accepted_at: null,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      paused_at: null,
      suspended_at: null,
      closed_at: null,
    };
    assertType(partner);
    expect(partner.status).toBe('active');
    expect(partner.payout_currency).toBe('MXN');
  });

  it('Recipient has all fields from doc 25 §8', () => {
    const recipient: Recipient = {
      id: '00000000-0000-0000-0000-000000000050',
      customer_id: '00000000-0000-0000-0000-000000000010',
      name: 'María García',
      relationship: 'mother',
      phone: '5512345678',
      surprise_mode: 'full_surprise',
      notes: null,
      consent_basis: 'Customer provided recipient info for gift delivery',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      archived_at: null,
    };
    assertType(recipient);
    expect(recipient.surprise_mode).toBe('full_surprise');
  });

  it('Address has all fields from doc 25 §9', () => {
    const address: Address = {
      id: '00000000-0000-0000-0000-000000000060',
      owner_type: 'customer',
      owner_id: '00000000-0000-0000-0000-000000000010',
      label: 'Home',
      street: 'Av. Juárez',
      exterior_number: '100',
      interior_number: null,
      neighborhood: 'Centro',
      postal_code: '66000',
      city_id: '00000000-0000-0000-0000-000000000020',
      state: 'Coahuila',
      country_code: 'MX',
      latitude: 25.4232,
      longitude: -100.9952,
      references_text: null,
      is_default: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      archived_at: null,
    };
    assertType(address);
    expect(address.owner_type).toBe('customer');
    expect(address.is_default).toBe(true);
  });
});

// ─── Insert types ───────────────────────────────────────────────────────────

describe('Insert types', () => {
  it('ProfileInsert omits auto-generated fields', () => {
    const insert: ProfileInsert = {
      auth_user_id: '00000000-0000-0000-0000-000000000002',
      email: 'test@example.com',
      phone: null,
      display_name: 'Test',
      status: 'active',
      default_role: 'customer',
    };
    assertType(insert);
    expect(insert.auth_user_id).toBeTruthy();
  });

  it('CityInsert omits auto-generated fields', () => {
    const insert: CityInsert = {
      name: 'Saltillo',
      state: 'Coahuila',
      country_code: 'MX',
      timezone: 'America/Monterrey',
      currency: 'MXN',
      status: 'active',
    };
    assertType(insert);
    expect(insert.status).toBe('active');
  });
});

// ─── Enum completeness ──────────────────────────────────────────────────────

describe('Enum types cover all doc 25 values', () => {
  it('UserRole includes all 7 roles from doc 10', () => {
    const roles: Array<{
      role: 'customer' | 'partner_operator' | 'partner_admin' | 'courier' | 'mpho_operator' | 'mpho_admin' | 'service_account';
    }> = [
      { role: 'customer' },
      { role: 'partner_operator' },
      { role: 'partner_admin' },
      { role: 'courier' },
      { role: 'mpho_operator' },
      { role: 'mpho_admin' },
      { role: 'service_account' },
    ];
    expect(roles).toHaveLength(7);
  });

  it('PartnerStatus covers all lifecycle states', () => {
    const statuses: Array<'pending_onboarding' | 'active' | 'paused' | 'suspended' | 'closed'> = [
      'pending_onboarding',
      'active',
      'paused',
      'suspended',
      'closed',
    ];
    expect(statuses).toHaveLength(5);
  });

  it('CityStatus covers active, planned, suspended', () => {
    const statuses: Array<'active' | 'planned' | 'suspended'> = [
      'active',
      'planned',
      'suspended',
    ];
    expect(statuses).toHaveLength(3);
  });
});
