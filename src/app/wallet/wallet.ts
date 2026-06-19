import { Component, signal, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  LucideIconProvider,
  LUCIDE_ICONS,
  Eye, EyeOff, TrendingUp, Users,
  ArrowDownCircle, ArrowUpCircle, Send, Clock,
  ChevronRight, ArrowRight, ArrowLeft, X,
  CircleAlert, CircleCheck,
  Wallet, Inbox, Smartphone, Building2,
  Download, Lock,
} from 'lucide-angular';

const WALLET_ICONS = {
  Eye, EyeOff, TrendingUp, Users,
  ArrowDownCircle, ArrowUpCircle, Send, Clock,
  ChevronRight, ArrowRight, ArrowLeft, X,
  CircleAlert, CircleCheck,
  Wallet, Inbox, Smartphone, Building2,
  Download, Lock,
};

type Lang = 'fr' | 'en';

const LABELS = {
  fr: {
    totalBalance:       'Solde total',
    thisMonth:          'ce mois',
    activeGroups:       'groupes actifs',
    deposit:            'Dépôt',
    withdraw:           'Retirer',
    transfer:           'Transférer',
    history:            'Historique',
    myGroups:           'Mes groupes',
    nextContrib:        'Prochain versement',
    recentTransactions: 'Transactions récentes',
    paid:               'Payé',
    pending:            'En attente',
    late:               'En retard',
    seeAll:             'Tout voir',
    depositTitle:       'Effectuer un dépôt',
    depositSubtitle:    'Rechargez votre portefeuille Djangi',
    depositAmount:      'Montant à déposer',
    depositAmountHint:  'Minimum 500 FCFA',
    depositMethod:      'Méthode de paiement',
    depositNote:        'Note (optionnel)',
    depositNotePlaceholder: 'Ex: Salaire juin, vente...',
    depositConfirm:     'Confirmer le dépôt',
    depositSuccess:     'Dépôt effectué avec succès !',
    withdrawTitle:      'Effectuer un retrait',
    withdrawSubtitle:   'Retirez des fonds de votre portefeuille',
    withdrawAmount:     'Montant à retirer',
    withdrawAmountHint: 'Solde disponible :',
    withdrawDestination:'Destination',
    withdrawPhone:      'Numéro de téléphone',
    withdrawPhonePh:    '6XX XXX XXX',
    withdrawNote:       'Motif (optionnel)',
    withdrawNotePh:     'Ex: Loyer, courses...',
    withdrawConfirm:    'Confirmer le retrait',
    withdrawSuccess:    'Retrait effectué avec succès !',
    transferTitle:      'Effectuer un transfert',
    transferSubtitle:   'Envoyez de l\'argent à un autre utilisateur',
    transferRecipient:  'Numéro du destinataire',
    transferRecipientPh:'6XX XXX XXX',
    transferAmount:     'Montant à envoyer',
    transferNote:       'Message (optionnel)',
    transferNotePh:     'Ex: Remboursement, cadeau...',
    transferConfirm:    'Confirmer le transfert',
    transferSuccess:    'Transfert effectué avec succès !',
    transferTo:         'Destinataire',
    historyTitle:       'Historique des transactions',
    historySubtitle:    'Toutes vos opérations',
    historyEmpty:       'Aucune transaction pour ce filtre.',
    filterAll:          'Tout',
    filterCredit:       'Entrées',
    filterDebit:        'Sorties',
    filterGroup:        'Groupes',
    cancel:             'Annuler',
    close:              'Fermer',
    processing:         'Traitement en cours...',
    amountError:        'Veuillez saisir un montant valide',
    insufficientFunds:  'Solde insuffisant',
    methodMobileMoney:  'Mobile Money',
    methodBankTransfer: 'Virement bancaire',
    methodOrangeMoney:  'Orange Money',
    methodMTNMoney:     'MTN Mobile Money',
    destMobileMoney:    'Mobile Money',
    destBank:           'Compte bancaire',
    destOrange:         'Orange Money',
    destMTN:            'MTN Mobile Money',
    fcfa:               'FCFA',
    quickAmounts:       'Montants rapides',
    downloadReceipt:    'Télécharger le reçu',
    pinTitle:           'Voir le solde',
    pinSubtitle:        'Entrez votre code PIN pour afficher votre solde',
    pinLabel:           'Code PIN',
    pinError:           'Code PIN incorrect',
    pinConfirm:         'Confirmer',
    revealBalance:      'Afficher le solde',
  },
  en: {
    totalBalance:       'Total Balance',
    thisMonth:          'this month',
    activeGroups:       'active groups',
    deposit:            'Deposit',
    withdraw:           'Withdraw',
    transfer:           'Transfer',
    history:            'History',
    myGroups:           'My Groups',
    nextContrib:        'Next contribution',
    recentTransactions: 'Recent Transactions',
    paid:               'Paid',
    pending:            'Pending',
    late:               'Late',
    seeAll:             'See all',
    depositTitle:       'Make a Deposit',
    depositSubtitle:    'Top up your Djangi wallet',
    depositAmount:      'Amount to deposit',
    depositAmountHint:  'Minimum 500 FCFA',
    depositMethod:      'Payment method',
    depositNote:        'Note (optional)',
    depositNotePlaceholder: 'e.g. June salary, sale...',
    depositConfirm:     'Confirm Deposit',
    depositSuccess:     'Deposit successful!',
    withdrawTitle:      'Make a Withdrawal',
    withdrawSubtitle:   'Withdraw funds from your wallet',
    withdrawAmount:     'Amount to withdraw',
    withdrawAmountHint: 'Available balance:',
    withdrawDestination:'Destination',
    withdrawPhone:      'Phone number',
    withdrawPhonePh:    '6XX XXX XXX',
    withdrawNote:       'Reason (optional)',
    withdrawNotePh:     'e.g. Rent, groceries...',
    withdrawConfirm:    'Confirm Withdrawal',
    withdrawSuccess:    'Withdrawal successful!',
    transferTitle:      'Make a Transfer',
    transferSubtitle:   'Send money to another user',
    transferRecipient:  'Recipient phone number',
    transferRecipientPh:'6XX XXX XXX',
    transferAmount:     'Amount to send',
    transferNote:       'Message (optional)',
    transferNotePh:     'e.g. Repayment, gift...',
    transferConfirm:    'Confirm Transfer',
    transferSuccess:    'Transfer successful!',
    transferTo:         'Recipient',
    historyTitle:       'Transaction History',
    historySubtitle:    'All your operations',
    historyEmpty:       'No transactions for this filter.',
    filterAll:          'All',
    filterCredit:       'Credits',
    filterDebit:        'Debits',
    filterGroup:        'Groups',
    cancel:             'Cancel',
    close:              'Close',
    processing:         'Processing...',
    amountError:        'Please enter a valid amount',
    insufficientFunds:  'Insufficient funds',
    methodMobileMoney:  'Mobile Money',
    methodBankTransfer: 'Bank Transfer',
    methodOrangeMoney:  'Orange Money',
    methodMTNMoney:     'MTN Mobile Money',
    destMobileMoney:    'Mobile Money',
    destBank:           'Bank Account',
    destOrange:         'Orange Money',
    destMTN:            'MTN Mobile Money',
    fcfa:               'FCFA',
    quickAmounts:       'Quick amounts',
    downloadReceipt:    'Download Receipt',
    pinTitle:           'View Balance',
    pinSubtitle:        'Enter your PIN to reveal your balance',
    pinLabel:           'PIN Code',
    pinError:           'Incorrect PIN',
    pinConfirm:         'Confirm',
    revealBalance:      'Show balance',
  },
} as const;

export interface GroupContribution {
  id:            string;
  name:          string;
  nextAmount:    number;
  dueDate:       string;
  rotationIndex: number;
  rotationTotal: number;
  status:        'paid' | 'pending' | 'late';
  avatarColor:   string;
}

export interface Transaction {
  id:        string;
  label:     string;
  labelFr:   string;
  date:      string;
  amount:    number;
  groupName: string;
}

export type ModalType = 'deposit' | 'withdraw' | 'transfer' | 'history' | 'pin' | null;
export type ModalStep = 'form' | 'confirm' | 'success';
export type HistoryFilter = 'all' | 'credit' | 'debit' | 'group';

const MOCK_BALANCE       = 1_250_000;
const MOCK_MONTHLY_DELTA =    45_000;
const MOCK_ACTIVE_GROUPS = 3;
const BALANCE_PIN        = '1234';

const MOCK_GROUPS: GroupContribution[] = [
  { id:'g1', name:'Tontine Famille',  nextAmount:25_000,  dueDate:'2025-07-05', rotationIndex:4, rotationTotal:8,  status:'paid',    avatarColor:'#1B3A2D' },
  { id:'g2', name:'Cercle Amis BTP', nextAmount:50_000,  dueDate:'2025-07-10', rotationIndex:1, rotationTotal:6,  status:'pending', avatarColor:'#4A7C59' },
  { id:'g3', name:'Njangi Pro',       nextAmount:100_000, dueDate:'2025-06-28', rotationIndex:3, rotationTotal:5,  status:'late',    avatarColor:'#C0392B' },
  { id:'g4', name:'Épargne Quartier', nextAmount:15_000,  dueDate:'2025-07-15', rotationIndex:2, rotationTotal:10, status:'pending', avatarColor:'#2980B9' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id:'t1', label:'Contribution received', labelFr:'Contribution reçue',   date:'2025-06-20', amount:+125_000, groupName:'Tontine Famille'  },
  { id:'t2', label:'Monthly payment',       labelFr:'Versement mensuel',     date:'2025-06-18', amount: -50_000, groupName:'Cercle Amis BTP'  },
  { id:'t3', label:'Withdrawal',            labelFr:'Retrait',               date:'2025-06-15', amount:-200_000, groupName:''                 },
  { id:'t4', label:'Deposit',               labelFr:'Dépôt',                 date:'2025-06-12', amount:+300_000, groupName:''                 },
  { id:'t5', label:'Late fee recovered',    labelFr:'Pénalité récupérée',    date:'2025-06-10', amount:  +5_000, groupName:'Njangi Pro'        },
  { id:'t6', label:'Group contribution',    labelFr:'Cotisation groupe',     date:'2025-06-08', amount: -25_000, groupName:'Épargne Quartier'  },
  { id:'t7', label:'Payout received',       labelFr:'Tour de tontine reçu',  date:'2025-06-05', amount:+500_000, groupName:'Njangi Pro'        },
  { id:'t8', label:'Monthly payment',       labelFr:'Versement mensuel',     date:'2025-06-01', amount:-100_000, groupName:'Njangi Pro'        },
  { id:'t9', label:'Deposit',               labelFr:'Dépôt',                 date:'2025-05-28', amount:+150_000, groupName:''                 },
  { id:'t10',label:'Withdrawal',            labelFr:'Retrait',               date:'2025-05-20', amount: -75_000, groupName:''                 },
];

const QUICK_AMOUNTS = [5_000, 10_000, 25_000, 50_000, 100_000, 250_000];

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  providers: [
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(WALLET_ICONS) },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './wallet.html',
  styleUrls: ['./wallet.css'],
})
export class WalletComponent {

  language = signal<Lang>('fr');

  // Balance hidden by default — user must enter PIN to reveal
  balanceVisible = signal(false);
  balance        = signal(MOCK_BALANCE);
  monthlyDelta   = signal(MOCK_MONTHLY_DELTA);
  activeGroups   = signal(MOCK_ACTIVE_GROUPS);
  groups         = signal<GroupContribution[]>(MOCK_GROUPS);
  transactions   = signal<Transaction[]>(MOCK_TRANSACTIONS);

  activeModal  = signal<ModalType>(null);
  modalStep    = signal<ModalStep>('form');
  isProcessing = signal(false);
  formError    = signal('');

  // PIN reveal
  pinInput     = signal('');
  pinError     = signal('');

  // Deposit
  depositAmountRaw = signal('');
  depositMethod    = signal('orange');
  depositNote      = signal('');

  // Withdraw
  withdrawAmountRaw = signal('');
  withdrawDest      = signal('orange');
  withdrawPhone     = signal('');
  withdrawNote      = signal('');

  // Transfer
  transferAmountRaw = signal('');
  transferRecipient = signal('');
  transferNote      = signal('');
  transferDest      = signal('orange');

  historyFilter = signal<HistoryFilter>('all');

  // Receipt data (filled on success)
  lastReceiptData = signal<{
    type: 'deposit' | 'withdraw' | 'transfer';
    amount: number;
    method: string;
    recipient?: string;
    note: string;
    date: string;
    ref: string;
    balanceAfter: number;
  } | null>(null);

  labels = computed(() => LABELS[this.language()] ?? LABELS['fr']);

  formattedBalance = computed(() =>
    this.balance().toLocaleString('fr-FR') + '\u00A0FCFA'
  );

  formattedDelta = computed(() =>
    '+\u00A0' + this.monthlyDelta().toLocaleString('fr-FR')
  );

  parsedDepositAmount  = computed(() => parseInt(this.depositAmountRaw(),  10) || 0);
  parsedWithdrawAmount = computed(() => parseInt(this.withdrawAmountRaw(), 10) || 0);
  parsedTransferAmount = computed(() => parseInt(this.transferAmountRaw(), 10) || 0);

  depositAmountDisplay = computed(() => {
    const n = this.parsedDepositAmount();
    return n > 0 ? n.toLocaleString('fr-FR') : '';
  });

  withdrawAmountDisplay = computed(() => {
    const n = this.parsedWithdrawAmount();
    return n > 0 ? n.toLocaleString('fr-FR') : '';
  });

  transferAmountDisplay = computed(() => {
    const n = this.parsedTransferAmount();
    return n > 0 ? n.toLocaleString('fr-FR') : '';
  });

  quickAmounts = QUICK_AMOUNTS;

  quickActions = computed(() => {
    const l = this.labels();
    return [
      { icon: 'arrow-down-circle', label: l.deposit,  action: 'deposit'  },
      { icon: 'arrow-up-circle',   label: l.withdraw, action: 'withdraw' },
      { icon: 'send',              label: l.transfer, action: 'transfer' },
      { icon: 'clock',             label: l.history,  action: 'history'  },
    ];
  });

  depositMethods = computed(() => {
    const l = this.labels();
    return [
      { value: 'orange', label: l.methodOrangeMoney,  icon: 'smartphone' },
      { value: 'mtn',    label: l.methodMTNMoney,     icon: 'smartphone' },
      { value: 'bank',   label: l.methodBankTransfer, icon: 'building-2' },
    ];
  });

  withdrawDests = computed(() => {
    const l = this.labels();
    return [
      { value: 'orange', label: l.destOrange, icon: 'smartphone' },
      { value: 'mtn',    label: l.destMTN,    icon: 'smartphone' },
      { value: 'bank',   label: l.destBank,   icon: 'building-2' },
    ];
  });

  transferDests = computed(() => {
    const l = this.labels();
    return [
      { value: 'orange', label: l.destOrange, icon: 'smartphone' },
      { value: 'mtn',    label: l.destMTN,    icon: 'smartphone' },
    ];
  });

  historyFilters = computed(() => {
    const l = this.labels();
    return [
      { value: 'all'    as HistoryFilter, label: l.filterAll    },
      { value: 'credit' as HistoryFilter, label: l.filterCredit },
      { value: 'debit'  as HistoryFilter, label: l.filterDebit  },
      { value: 'group'  as HistoryFilter, label: l.filterGroup  },
    ];
  });

  filteredTransactions = computed(() => {
    const txs = this.transactions();
    switch (this.historyFilter()) {
      case 'credit': return txs.filter(t => t.amount > 0);
      case 'debit':  return txs.filter(t => t.amount < 0);
      case 'group':  return txs.filter(t => !!t.groupName);
      default:       return txs;
    }
  });

  // ── Balance PIN reveal ────────────────────────────────────────────────────
  toggleBalance(): void {
    if (this.balanceVisible()) {
      this.balanceVisible.set(false);
    } else {
      this.openModal('pin');
    }
  }

  submitPin(): void {
    if (this.pinInput() === BALANCE_PIN) {
      this.balanceVisible.set(true);
      this.pinInput.set('');
      this.pinError.set('');
      this.closeModal();
    } else {
      this.pinError.set(this.labels().pinError);
      this.pinInput.set('');
    }
  }

  onPinInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4);
    this.pinInput.set(val);
    this.pinError.set('');
    if (val.length === 4) {
      // Auto-submit when 4 digits entered
      setTimeout(() => this.submitPin(), 120);
    }
  }

  // ── Wallet helpers ────────────────────────────────────────────────────────
  formatAmount(n: number): string {
    return Math.abs(n).toLocaleString('fr-FR') + '\u00A0FCFA';
  }

  progressPercent(g: GroupContribution): number {
    return Math.round((g.rotationIndex / g.rotationTotal) * 100);
  }

  formatDueDate(iso: string): string {
    return new Date(iso).toLocaleDateString(
      this.language() === 'fr' ? 'fr-FR' : 'en-GB',
      { day: 'numeric', month: 'short' }
    );
  }

  txLabel(tx: Transaction): string {
    return this.language() === 'fr' ? tx.labelFr : tx.label;
  }

  txDate(iso: string): string {
    return new Date(iso).toLocaleDateString(
      this.language() === 'fr' ? 'fr-FR' : 'en-GB',
      { day: 'numeric', month: 'short', year: 'numeric' }
    );
  }

  // ── Modal control ─────────────────────────────────────────────────────────
  onAction(action: string): void {
    if (action === 'deposit' || action === 'withdraw' || action === 'transfer' || action === 'history') {
      this.openModal(action);
    }
  }

  openModal(type: ModalType): void {
    this.activeModal.set(type);
    this.modalStep.set('form');
    this.formError.set('');
    this.isProcessing.set(false);
    this.pinInput.set('');
    this.pinError.set('');
    this.depositAmountRaw.set('');
    this.depositMethod.set('orange');
    this.depositNote.set('');
    this.withdrawAmountRaw.set('');
    this.withdrawDest.set('orange');
    this.withdrawPhone.set('');
    this.withdrawNote.set('');
    this.transferAmountRaw.set('');
    this.transferRecipient.set('');
    this.transferNote.set('');
    this.transferDest.set('orange');
    this.historyFilter.set('all');
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    if (this.isProcessing()) return;
    this.activeModal.set(null);
    document.body.style.overflow = '';
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('wlt-modal-backdrop')) {
      this.closeModal();
    }
  }

  backToForm(): void {
    this.modalStep.set('form');
    this.formError.set('');
  }

  setQuickAmount(amount: number, type: 'deposit' | 'withdraw' | 'transfer'): void {
    if (type === 'deposit')  this.depositAmountRaw.set(amount.toString());
    if (type === 'withdraw') this.withdrawAmountRaw.set(amount.toString());
    if (type === 'transfer') this.transferAmountRaw.set(amount.toString());
    this.formError.set('');
  }

  onDepositAmountInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    this.depositAmountRaw.set(raw);
    this.formError.set('');
  }

  onWithdrawAmountInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    this.withdrawAmountRaw.set(raw);
    this.formError.set('');
  }

  onTransferAmountInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    this.transferAmountRaw.set(raw);
    this.formError.set('');
  }

  // ── Deposit flow ──────────────────────────────────────────────────────────
  submitDeposit(): void {
    const amount = this.parsedDepositAmount();
    if (!amount || amount < 500) { this.formError.set(this.labels().amountError); return; }
    this.formError.set('');
    this.modalStep.set('confirm');
  }

  confirmDeposit(): void {
    this.isProcessing.set(true);
    setTimeout(() => {
      const amount = this.parsedDepositAmount();
      const method = this.depositMethods().find(m => m.value === this.depositMethod())?.label ?? '';
      this.balance.update(b => b + amount);
      this.monthlyDelta.update(d => d + amount);
      const ref = 'DEP-' + Date.now().toString(36).toUpperCase();
      this.transactions.update(txs => [{
        id: 't' + Date.now(), label: 'Deposit', labelFr: 'Dépôt',
        date: new Date().toISOString().slice(0, 10), amount: +amount, groupName: '',
      }, ...txs]);
      this.lastReceiptData.set({
        type: 'deposit', amount, method,
        note: this.depositNote(),
        date: new Date().toLocaleString(this.language() === 'fr' ? 'fr-FR' : 'en-GB'),
        ref, balanceAfter: this.balance(),
      });
      this.isProcessing.set(false);
      this.modalStep.set('success');
    }, 1800);
  }

  // ── Withdraw flow ─────────────────────────────────────────────────────────
  submitWithdraw(): void {
    const amount = this.parsedWithdrawAmount();
    if (!amount || amount < 500) { this.formError.set(this.labels().amountError); return; }
    if (amount > this.balance()) { this.formError.set(this.labels().insufficientFunds); return; }
    this.formError.set('');
    this.modalStep.set('confirm');
  }

  confirmWithdraw(): void {
    this.isProcessing.set(true);
    setTimeout(() => {
      const amount = this.parsedWithdrawAmount();
      const dest = this.withdrawDests().find(d => d.value === this.withdrawDest())?.label ?? '';
      this.balance.update(b => b - amount);
      const ref = 'WDR-' + Date.now().toString(36).toUpperCase();
      this.transactions.update(txs => [{
        id: 't' + Date.now(), label: 'Withdrawal', labelFr: 'Retrait',
        date: new Date().toISOString().slice(0, 10), amount: -amount, groupName: '',
      }, ...txs]);
      this.lastReceiptData.set({
        type: 'withdraw', amount, method: dest,
        recipient: '+237 ' + this.withdrawPhone(),
        note: this.withdrawNote(),
        date: new Date().toLocaleString(this.language() === 'fr' ? 'fr-FR' : 'en-GB'),
        ref, balanceAfter: this.balance(),
      });
      this.isProcessing.set(false);
      this.modalStep.set('success');
    }, 1800);
  }

  // ── Transfer flow ─────────────────────────────────────────────────────────
  submitTransfer(): void {
    const amount = this.parsedTransferAmount();
    if (!amount || amount < 500) { this.formError.set(this.labels().amountError); return; }
    if (amount > this.balance()) { this.formError.set(this.labels().insufficientFunds); return; }
    if (!this.transferRecipient().trim()) {
      this.formError.set(this.language() === 'fr' ? 'Veuillez entrer un numéro de destinataire' : 'Please enter a recipient number');
      return;
    }
    this.formError.set('');
    this.modalStep.set('confirm');
  }

  confirmTransfer(): void {
    this.isProcessing.set(true);
    setTimeout(() => {
      const amount = this.parsedTransferAmount();
      const dest = this.transferDests().find(d => d.value === this.transferDest())?.label ?? '';
      this.balance.update(b => b - amount);
      const ref = 'TRF-' + Date.now().toString(36).toUpperCase();
      this.transactions.update(txs => [{
        id: 't' + Date.now(), label: 'Transfer', labelFr: 'Transfert',
        date: new Date().toISOString().slice(0, 10), amount: -amount, groupName: '',
      }, ...txs]);
      this.lastReceiptData.set({
        type: 'transfer', amount, method: dest,
        recipient: '+237 ' + this.transferRecipient(),
        note: this.transferNote(),
        date: new Date().toLocaleString(this.language() === 'fr' ? 'fr-FR' : 'en-GB'),
        ref, balanceAfter: this.balance(),
      });
      this.isProcessing.set(false);
      this.modalStep.set('success');
    }, 1800);
  }

  // ── Receipt download ──────────────────────────────────────────────────────
  downloadReceipt(): void {
    const r = this.lastReceiptData();
    if (!r) return;
    const l = this.labels();
    const typeLabel = r.type === 'deposit' ? l.deposit : r.type === 'withdraw' ? l.withdraw : l.transfer;
    const sign = r.type === 'deposit' ? '+' : '-';

    const html = `
<!DOCTYPE html>
<html lang="${this.language()}">
<head>
  <meta charset="UTF-8"/>
  <title>Reçu ${typeLabel} — Djangi</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: -apple-system, Helvetica, Arial, sans-serif; background:#F7F3ED; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:2rem; }
    .receipt { background:#fff; border-radius:24px; max-width:400px; width:100%; padding:2.5rem 2rem; box-shadow:0 8px 32px rgba(27,58,45,.14); }
    .logo { text-align:center; margin-bottom:1.5rem; }
    .logo h1 { font-size:1.5rem; font-weight:800; color:#1B3A2D; letter-spacing:-0.02em; }
    .logo p { font-size:0.75rem; color:#6B6B6B; margin-top:0.2rem; }
    .amount-block { text-align:center; padding:1.5rem 0; border-top:1px solid #F0EBE3; border-bottom:1px solid #F0EBE3; margin-bottom:1.5rem; }
    .amount-block .type { font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#6B6B6B; margin-bottom:0.5rem; }
    .amount-block .amount { font-size:2.5rem; font-weight:800; letter-spacing:-0.03em; color:${r.type === 'deposit' ? '#4A7C59' : '#C0392B'}; }
    .amount-block .currency { font-size:1rem; font-weight:600; }
    .rows { display:flex; flex-direction:column; gap:0; }
    .row { display:flex; justify-content:space-between; align-items:center; padding:0.75rem 0; border-bottom:1px solid #F7F3ED; }
    .row:last-child { border-bottom:none; }
    .row .k { font-size:0.78rem; color:#6B6B6B; font-weight:500; }
    .row .v { font-size:0.85rem; color:#1A1A1A; font-weight:600; text-align:right; max-width:60%; }
    .ref { text-align:center; margin-top:1.5rem; padding-top:1.5rem; border-top:1px dashed #E5DDD3; }
    .ref p { font-size:0.68rem; color:#A0A0A0; margin-bottom:0.25rem; }
    .ref code { font-size:0.8rem; font-weight:700; color:#1B3A2D; letter-spacing:0.05em; }
    .footer { text-align:center; margin-top:1.5rem; font-size:0.68rem; color:#A0A0A0; }
    @media print { body { background:white; } .receipt { box-shadow:none; } }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="logo">
      <h1>Djangi</h1>
      <p>${this.language() === 'fr' ? 'Reçu de transaction' : 'Transaction Receipt'}</p>
    </div>
    <div class="amount-block">
      <div class="type">${typeLabel}</div>
      <div class="amount">${sign}${r.amount.toLocaleString('fr-FR')} <span class="currency">FCFA</span></div>
    </div>
    <div class="rows">
      <div class="row"><span class="k">${this.language() === 'fr' ? 'Date' : 'Date'}</span><span class="v">${r.date}</span></div>
      <div class="row"><span class="k">${this.language() === 'fr' ? 'Méthode' : 'Method'}</span><span class="v">${r.method}</span></div>
      ${r.recipient ? `<div class="row"><span class="k">${r.type === 'transfer' ? l.transferTo : l.withdrawPhone}</span><span class="v">${r.recipient}</span></div>` : ''}
      ${r.note ? `<div class="row"><span class="k">${this.language() === 'fr' ? 'Note' : 'Note'}</span><span class="v">${r.note}</span></div>` : ''}
      <div class="row"><span class="k">${this.language() === 'fr' ? 'Solde après' : 'Balance after'}</span><span class="v" style="color:#1B3A2D">${r.balanceAfter.toLocaleString('fr-FR')} FCFA</span></div>
    </div>
    <div class="ref">
      <p>${this.language() === 'fr' ? 'Référence' : 'Reference'}</p>
      <code>${r.ref}</code>
    </div>
    <div class="footer">Djangi · ${this.language() === 'fr' ? 'Gardez ce reçu comme preuve de transaction' : 'Keep this receipt as proof of transaction'}</div>
  </div>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url, '_blank');
    if (!win) {
      // Fallback: direct download
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${r.ref}.html`;
      a.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  // ── Label lookups ─────────────────────────────────────────────────────────
  get selectedDepositMethodLabel(): string {
    return this.depositMethods().find(m => m.value === this.depositMethod())?.label ?? '';
  }

  get selectedWithdrawDestLabel(): string {
    return this.withdrawDests().find(d => d.value === this.withdrawDest())?.label ?? '';
  }

  get selectedTransferDestLabel(): string {
    return this.transferDests().find(d => d.value === this.transferDest())?.label ?? '';
  }
}

export { WalletComponent as Wallet };