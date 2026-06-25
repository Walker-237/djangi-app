import { Component, signal, computed, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WalletService } from '../core/services/wallet.service';
import { TokenService } from '../core/services/token.service';
import { AuthService } from '../core/services/auth.service';
import { Wallet as ApiWallet, WalletTransaction } from '../core/models/models';
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
    totalBalance: 'Solde total',
    thisMonth: 'ce mois',
    activeGroups: 'groupes actifs',
    deposit: 'Dépôt',
    withdraw: 'Retirer',
    transfer: 'Transférer',
    history: 'Historique',
    myGroups: 'Mes groupes',
    nextContrib: 'Prochain versement',
    recentTransactions: 'Transactions récentes',
    paid: 'Payé',
    pending: 'En attente',
    late: 'En retard',
    seeAll: 'Tout voir',
    depositTitle: 'Effectuer un dépôt',
    depositSubtitle: 'Rechargez votre portefeuille Djangi',
    depositAmount: 'Montant à déposer',
    depositAmountHint: 'Minimum 500 FCFA',
    depositMethod: 'Méthode de paiement',
    depositNote: 'Note (optionnel)',
    depositNotePlaceholder: 'Ex: Salaire juin, vente...',
    depositConfirm: 'Confirmer le dépôt',
    depositSuccess: 'Dépôt effectué avec succès !',
    withdrawTitle: 'Effectuer un retrait',
    withdrawSubtitle: 'Retirez des fonds de votre portefeuille',
    withdrawAmount: 'Montant à retirer',
    withdrawAmountHint: 'Solde disponible :',
    withdrawDestination: 'Destination',
    withdrawPhone: 'Numéro de téléphone',
    withdrawPhonePh: '6XX XXX XXX',
    withdrawNote: 'Motif (optionnel)',
    withdrawNotePh: 'Ex: Loyer, courses...',
    withdrawConfirm: 'Confirmer le retrait',
    withdrawSuccess: 'Retrait effectué avec succès !',
    transferTitle: 'Effectuer un transfert',
    transferSubtitle: 'Envoyez de l\'argent à un autre utilisateur',
    transferRecipient: 'Numéro du destinataire',
    transferRecipientPh: '6XX XXX XXX',
    transferAmount: 'Montant à envoyer',
    transferNote: 'Message (optionnel)',
    transferNotePh: 'Ex: Remboursement, cadeau...',
    transferConfirm: 'Confirmer le transfert',
    transferSuccess: 'Transfert effectué avec succès !',
    transferTo: 'Destinataire',
    historyTitle: 'Historique des transactions',
    historySubtitle: 'Toutes vos opérations',
    historyEmpty: 'Aucune transaction pour ce filtre.',
    filterAll: 'Tout',
    filterCredit: 'Entrées',
    filterDebit: 'Sorties',
    filterGroup: 'Groupes',
    cancel: 'Annuler',
    close: 'Fermer',
    processing: 'Traitement en cours...',
    amountError: 'Veuillez saisir un montant valide',
    insufficientFunds: 'Solde insuffisant',
    methodMobileMoney: 'Mobile Money',
    methodBankTransfer: 'Virement bancaire',
    methodOrangeMoney: 'Orange Money',
    methodMTNMoney: 'MTN Mobile Money',
    destMobileMoney: 'Mobile Money',
    destBank: 'Compte bancaire',
    destOrange: 'Orange Money',
    destMTN: 'MTN Mobile Money',
    fcfa: 'FCFA',
    quickAmounts: 'Montants rapides',
    downloadReceipt: 'Télécharger le reçu',
    pinTitle: 'Voir le solde',
    pinSubtitle: 'Entrez votre code PIN pour afficher votre solde',
    pinLabel: 'Code PIN',
    pinError: 'Code PIN incorrect',
    pinConfirm: 'Confirmer',
    revealBalance: 'Afficher le solde',
  },
  en: {
    totalBalance: 'Total Balance',
    thisMonth: 'this month',
    activeGroups: 'active groups',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    transfer: 'Transfer',
    history: 'History',
    myGroups: 'My Groups',
    nextContrib: 'Next contribution',
    recentTransactions: 'Recent Transactions',
    paid: 'Paid',
    pending: 'Pending',
    late: 'Late',
    seeAll: 'See all',
    depositTitle: 'Make a Deposit',
    depositSubtitle: 'Top up your Djangi wallet',
    depositAmount: 'Amount to deposit',
    depositAmountHint: 'Minimum 500 FCFA',
    depositMethod: 'Payment method',
    depositNote: 'Note (optional)',
    depositNotePlaceholder: 'e.g. June salary, sale...',
    depositConfirm: 'Confirm Deposit',
    depositSuccess: 'Deposit successful!',
    withdrawTitle: 'Make a Withdrawal',
    withdrawSubtitle: 'Withdraw funds from your wallet',
    withdrawAmount: 'Amount to withdraw',
    withdrawAmountHint: 'Available balance:',
    withdrawDestination: 'Destination',
    withdrawPhone: 'Phone number',
    withdrawPhonePh: '6XX XXX XXX',
    withdrawNote: 'Reason (optional)',
    withdrawNotePh: 'e.g. Rent, groceries...',
    withdrawConfirm: 'Confirm Withdrawal',
    withdrawSuccess: 'Withdrawal successful!',
    transferTitle: 'Make a Transfer',
    transferSubtitle: 'Send money to another user',
    transferRecipient: 'Recipient phone number',
    transferRecipientPh: '6XX XXX XXX',
    transferAmount: 'Amount to send',
    transferNote: 'Message (optional)',
    transferNotePh: 'e.g. Repayment, gift...',
    transferConfirm: 'Confirm Transfer',
    transferSuccess: 'Transfer successful!',
    transferTo: 'Recipient',
    historyTitle: 'Transaction History',
    historySubtitle: 'All your operations',
    historyEmpty: 'No transactions for this filter.',
    filterAll: 'All',
    filterCredit: 'Credits',
    filterDebit: 'Debits',
    filterGroup: 'Groups',
    cancel: 'Cancel',
    close: 'Close',
    processing: 'Processing...',
    amountError: 'Please enter a valid amount',
    insufficientFunds: 'Insufficient funds',
    methodMobileMoney: 'Mobile Money',
    methodBankTransfer: 'Bank Transfer',
    methodOrangeMoney: 'Orange Money',
    methodMTNMoney: 'MTN Mobile Money',
    destMobileMoney: 'Mobile Money',
    destBank: 'Bank Account',
    destOrange: 'Orange Money',
    destMTN: 'MTN Mobile Money',
    fcfa: 'FCFA',
    quickAmounts: 'Quick amounts',
    downloadReceipt: 'Download Receipt',
    pinTitle: 'View Balance',
    pinSubtitle: 'Enter your PIN to reveal your balance',
    pinLabel: 'PIN Code',
    pinError: 'Incorrect PIN',
    pinConfirm: 'Confirm',
    revealBalance: 'Show balance',
  },
} as const;

export interface GroupContribution {
  id: string;
  name: string;
  nextAmount: number;
  dueDate: string;
  rotationIndex: number;
  rotationTotal: number;
  status: 'paid' | 'pending' | 'late';
  avatarColor: string;
}

export interface Transaction {
  id: string;
  label: string;
  labelFr: string;
  date: string;
  amount: number;
  groupName: string;
}

export type ModalType = 'deposit' | 'withdraw' | 'transfer' | 'history' | 'pin' | 'receipt' | null;
export type ModalStep = 'form' | 'confirm' | 'success';
export type HistoryFilter = 'all' | 'credit' | 'debit' | 'group';

const INITIAL_BALANCE = 0;
const INITIAL_MONTHLY_DELTA = 0;
const INITIAL_ACTIVE_GROUPS = 0;
const INITIAL_GROUPS: GroupContribution[] = [];
const INITIAL_TRANSACTIONS: Transaction[] = [];
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
  private readonly walletService = inject(WalletService);
  private readonly tokenService = inject(TokenService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  language = signal<Lang>('fr');

  balanceVisible = signal(false);
  balance = signal(INITIAL_BALANCE);
  monthlyDelta = signal(INITIAL_MONTHLY_DELTA);
  activeGroups = signal(INITIAL_ACTIVE_GROUPS);
  groups = signal<GroupContribution[]>(INITIAL_GROUPS);
  transactions = signal<Transaction[]>(INITIAL_TRANSACTIONS);
  loading = signal(false);
  error = signal<string | null>(null);

  activeModal = signal<ModalType>(null);
  modalStep = signal<ModalStep>('form');
  isProcessing = signal(false);
  formError = signal('');

  pinInput = signal('');
  pinError = signal('');

  depositAmountRaw = signal('');
  depositMethod = signal('orange');
  depositNote = signal('');

  withdrawAmountRaw = signal('');
  withdrawDest = signal('orange');
  withdrawPhone = signal('');
  withdrawNote = signal('');

  transferAmountRaw = signal('');
  transferRecipient = signal('');
  transferNote = signal('');
  transferDest = signal('orange');

  historyFilter = signal<HistoryFilter>('all');

  lastReceiptData = signal<{
    type: 'deposit' | 'withdraw' | 'transfer' | 'receipt';
    label: string;
    amount: number;
    method: string;
    recipient?: string;
    note: string;
    date: string;
    ref: string;
    balanceAfter: number;
    groupName?: string;
  } | null>(null);

  ngOnInit(): void {
    this.loadWallet();
  }

  loadWallet(): void {
    this.loading.set(true);
    this.error.set(null);

    this.walletService.getWallet().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (wallet) => this.applyWallet(wallet),
      error: () => {
        this.error.set(this.language() === 'fr' ? 'Impossible de charger le portefeuille.' : 'Unable to load wallet.');
        this.loading.set(false);
      },
    });

    this.walletService.getHistory(0, 50).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (history) => this.transactions.set(history.map((tx) => this.toTransaction(tx))),
      error: () => this.error.set(this.language() === 'fr' ? 'Impossible de charger l historique.' : 'Unable to load history.'),
    });
  }

  labels = computed(() => LABELS[this.language()] ?? LABELS['fr']);

  formattedBalance = computed(() =>
    this.balance().toLocaleString('fr-FR') + '\u00A0FCFA'
  );

  formattedDelta = computed(() =>
    '+\u00A0' + this.monthlyDelta().toLocaleString('fr-FR')
  );

  parsedDepositAmount = computed(() => parseInt(this.depositAmountRaw(), 10) || 0);
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
      { icon: 'arrow-down-circle', label: l.deposit, action: 'deposit' },
      { icon: 'arrow-up-circle', label: l.withdraw, action: 'withdraw' },
      { icon: 'send', label: l.transfer, action: 'transfer' },
      { icon: 'clock', label: l.history, action: 'history' },
    ];
  });

  depositMethods = computed(() => {
    const l = this.labels();
    return [
      { value: 'orange', label: l.methodOrangeMoney, icon: 'smartphone' },
      { value: 'mtn', label: l.methodMTNMoney, icon: 'smartphone' },
      { value: 'bank', label: l.methodBankTransfer, icon: 'building-2' },
    ];
  });

  withdrawDests = computed(() => {
    const l = this.labels();
    return [
      { value: 'orange', label: l.destOrange, icon: 'smartphone' },
      { value: 'mtn', label: l.destMTN, icon: 'smartphone' },
      { value: 'bank', label: l.destBank, icon: 'building-2' },
    ];
  });

  transferDests = computed(() => {
    const l = this.labels();
    return [
      { value: 'orange', label: l.destOrange, icon: 'smartphone' },
      { value: 'mtn', label: l.destMTN, icon: 'smartphone' },
    ];
  });

  historyFilters = computed(() => {
    const l = this.labels();
    return [
      { value: 'all' as HistoryFilter, label: l.filterAll },
      { value: 'credit' as HistoryFilter, label: l.filterCredit },
      { value: 'debit' as HistoryFilter, label: l.filterDebit },
      { value: 'group' as HistoryFilter, label: l.filterGroup },
    ];
  });

  filteredTransactions = computed(() => {
    const txs = this.transactions();
    switch (this.historyFilter()) {
      case 'credit': return txs.filter(t => t.amount > 0);
      case 'debit': return txs.filter(t => t.amount < 0);
      case 'group': return txs.filter(t => !!t.groupName);
      default: return txs;
    }
  });

  toggleBalance(): void {
    if (this.balanceVisible()) {
      this.balanceVisible.set(false);
    } else {
      this.openModal('pin');
    }
  }

  submitPin(): void {
    if (this.pinInput().length !== 4) return;
    this.isProcessing.set(true);
    this.authService.verifyPin(this.pinInput()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.balanceVisible.set(true);
        this.pinInput.set('');
        this.pinError.set('');
        this.isProcessing.set(false);
        this.closeModal();
        this.loadWallet();
      },
      error: () => {
        this.pinError.set(this.labels().pinError);
        this.pinInput.set('');
        this.isProcessing.set(false);
      },
    });
  }

  onPinInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4);
    this.pinInput.set(val);
    this.pinError.set('');
    if (val.length === 4) {
      setTimeout(() => this.submitPin(), 120);
    }
  }

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

  onAction(action: string): void {
    if (action === 'deposit' || action === 'withdraw' || action === 'transfer' || action === 'history') {
      this.openModal(action);
    }
  }

  openReceipt(tx: Transaction): void {
    const label = this.language() === 'fr' ? tx.labelFr : tx.label;
    const amount = Math.abs(tx.amount);
    const ref = 'RCT-' + tx.id.toUpperCase();
    const method = tx.groupName || (tx.amount >= 0 ? this.labels().deposit : this.labels().withdraw);
    this.lastReceiptData.set({
      type: 'receipt',
      label,
      amount,
      method,
      recipient: tx.groupName || undefined,
      note: '',
      date: this.txDate(tx.date),
      ref,
      balanceAfter: this.balance(),
      groupName: tx.groupName || undefined,
    });
    this.activeModal.set('receipt');
    document.body.style.overflow = 'hidden';
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
    if (type === 'deposit') this.depositAmountRaw.set(amount.toString());
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
  
  submitDeposit(): void {
  const amount = this.parsedDepositAmount();
  if (!amount || amount < 500) { this.formError.set(this.labels().amountError); return; }
  this.formError.set('');
  this.modalStep.set('confirm');
}

submitWithdraw(): void {
  const amount = this.parsedWithdrawAmount();
  if (!amount || amount < 500) { this.formError.set(this.labels().amountError); return; }
  if (amount > this.balance()) { this.formError.set(this.labels().insufficientFunds); return; }
  this.formError.set('');
  this.modalStep.set('confirm');
}

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

  confirmDeposit(): void {
  this.isProcessing.set(true);
  const amount = this.parsedDepositAmount();
  const method = this.apiMethod(this.depositMethod());
  this.walletService.deposit(amount, method, this.depositNote() || undefined)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (wallet) => {
        this.applyWallet(wallet);
        const ref = 'DEP-' + Date.now().toString(36).toUpperCase();
        this.transactions.update(txs => [{ id: ref, label: 'Deposit', labelFr: 'Dépôt', date: new Date().toISOString().slice(0, 10), amount: +amount, groupName: '' }, ...txs]);
        this.lastReceiptData.set({ type: 'deposit', label: this.language() === 'fr' ? 'Dépôt' : 'Deposit', amount, method: this.selectedDepositMethodLabel, note: this.depositNote(), date: new Date().toLocaleString(), ref, balanceAfter: this.balance() });
        this.isProcessing.set(false);
        this.modalStep.set('success');
      },
      error: () => {
        this.formError.set(this.language() === 'fr' ? 'Echec du dépôt.' : 'Deposit failed.');
        this.isProcessing.set(false);
      },
    });
}

confirmWithdraw(): void {
  this.isProcessing.set(true);
  const amount = this.parsedWithdrawAmount();
  const method = this.apiMethod(this.withdrawDest());
  this.walletService.withdraw(amount, method, this.withdrawNote() || undefined)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (wallet) => {
        this.applyWallet(wallet);
        const ref = 'WDR-' + Date.now().toString(36).toUpperCase();
        this.transactions.update(txs => [{ id: ref, label: 'Withdrawal', labelFr: 'Retrait', date: new Date().toISOString().slice(0, 10), amount: -amount, groupName: '' }, ...txs]);
        this.lastReceiptData.set({ type: 'withdraw', label: this.language() === 'fr' ? 'Retrait' : 'Withdrawal', amount, method: this.selectedWithdrawDestLabel, recipient: '+237 ' + this.withdrawPhone(), note: this.withdrawNote(), date: new Date().toLocaleString(), ref, balanceAfter: this.balance() });
        this.isProcessing.set(false);
        this.modalStep.set('success');
      },
      error: () => {
        this.formError.set(this.language() === 'fr' ? 'Echec du retrait.' : 'Withdrawal failed.');
        this.isProcessing.set(false);
      },
    });
}

confirmTransfer(): void {
  this.isProcessing.set(true);
  const amount = this.parsedTransferAmount();
  this.walletService.transfer(this.transferRecipient(), amount, this.transferNote() || undefined)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (wallet) => {
        this.applyWallet(wallet);
        const ref = 'TRF-' + Date.now().toString(36).toUpperCase();
        this.transactions.update(txs => [{ id: ref, label: 'Transfer', labelFr: 'Transfert', date: new Date().toISOString().slice(0, 10), amount: -amount, groupName: '' }, ...txs]);
        this.lastReceiptData.set({ type: 'transfer', label: this.language() === 'fr' ? 'Transfert' : 'Transfer', amount, method: this.selectedTransferDestLabel, recipient: '+237 ' + this.transferRecipient(), note: this.transferNote(), date: new Date().toLocaleString(), ref, balanceAfter: this.balance() });
        this.isProcessing.set(false);
        this.modalStep.set('success');
      },
      error: () => {
        this.formError.set(this.language() === 'fr' ? 'Echec du transfert.' : 'Transfer failed.');
        this.isProcessing.set(false);
      },
    });
}

  downloadReceipt(): void {
    const r = this.lastReceiptData();
    if (!r) return;
    // ... (receipt download logic remains unchanged)
    console.log('Downloading receipt...', r);
  }

  private applyWallet(wallet: ApiWallet): void {
    this.balance.set(wallet.balance);
    this.monthlyDelta.set(wallet.monthlyDelta ?? 0);
    this.activeGroups.set(wallet.activeGroups ?? 0);
    this.loading.set(false);
  }

  private apiMethod(value: string): 'mobile_money' | 'bank' {
    return value === 'bank' ? 'bank' : 'mobile_money';
  }

  private toTransaction(tx: WalletTransaction): Transaction {
    return {
      id: tx.id,
      label: tx.label,
      labelFr: tx.label,
      date: tx.createdAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
      amount: tx.type === 'withdrawal' || tx.type === 'transfer_out' || tx.type === 'contribution_paid' || tx.type === 'admin_debit' 
        ? -Math.abs(tx.amount) 
        : Math.abs(tx.amount),
      groupName: tx.groupName ?? '',
    };
  }

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