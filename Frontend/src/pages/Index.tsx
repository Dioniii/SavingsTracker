import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Wallet, Trash2 } from "lucide-react";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface FinancialAccount {
  id: string;
  account_name: string;
  balance: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [showNewAccountForm, setShowNewAccountForm] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountBalance, setNewAccountBalance] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<FinancialAccount | null>(null);
  const [mainBalance, setMainBalance] = useState<number>(0);
  const [editingMainBalance, setEditingMainBalance] = useState(false);
  const [mainBalanceInput, setMainBalanceInput] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const response = await axios.get("http://localhost:4000/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAccounts(response.data.accounts || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch accounts.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch accounts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const accountToRemove = accounts.find(acc => acc.id === accountId);
      const response = await axios.delete(`http://localhost:4000/delete/${accountId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success || response.status === 200) {
        if (accountToRemove) setMainBalance(prev => prev + accountToRemove.balance);
        toast({
          title: "Account deleted",
          description: "The account has been removed successfully.",
        });
        fetchAccounts();
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to delete account.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAccountName.trim()) {
      toast({
        title: "Error",
        description: "Account name is required",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(Number(newAccountBalance)) || Number(newAccountBalance) < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid balance",
        variant: "destructive",
      });
      return;
    }

    if (Number(newAccountBalance) > mainBalance) {
      toast({
        title: "Error",
        description: "Insufficient funds in Total Balance.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const response = await axios.post(
        "http://localhost:4000/create-account",
        {
          account_name: newAccountName.trim(),
          balance: Number(newAccountBalance),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMainBalance(prev => prev - Number(newAccountBalance));
        fetchAccounts();
        setNewAccountName("");
        setNewAccountBalance("");
        setShowNewAccountForm(false);
        toast({
          title: "Account created",
          description: `${newAccountName} account has been created successfully.`,
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to create account",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="finance-logo text-xl">FinTrack</div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="mb-4 flex flex-col items-start">
            <span className="text-gray-500 text-sm">Total Balance</span>
            <div className="flex items-center gap-2">
              {editingMainBalance ? (
                <>
                  <input
                    type="number"
                    className="border rounded px-2 py-1 text-2xl font-bold w-32"
                    value={mainBalanceInput}
                    onChange={e => setMainBalanceInput(e.target.value)}
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      setMainBalance(Number(mainBalanceInput));
                      setEditingMainBalance(false);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingMainBalance(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-3xl font-bold">${mainBalance.toFixed(2)}</span>
                  <Button size="sm" variant="outline" onClick={() => { setMainBalanceInput(mainBalance.toString()); setEditingMainBalance(true); }}>
                    Edit
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Your Accounts</h1>
            <Button
              onClick={() => setShowNewAccountForm(true)}
              className="flex items-center gap-1"
              disabled={showNewAccountForm}
            >
              <PlusCircle size={16} />
              Add Account
            </Button>
          </div>

          {showNewAccountForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create New Account</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAccount} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                      id="accountName"
                      value={newAccountName}
                      onChange={(e) => setNewAccountName(e.target.value)}
                      placeholder="e.g., Checking Account"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountBalance">Initial Balance</Label>
                    <Input
                      id="accountBalance"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newAccountBalance}
                      onChange={(e) => setNewAccountBalance(e.target.value)}
                      placeholder="0.00"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Account"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewAccountForm(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {accounts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Wallet className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No accounts</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new financial account.
              </p>
              {!showNewAccountForm && (
                <div className="mt-6">
                  <Button
                    onClick={() => setShowNewAccountForm(true)}
                    className="flex items-center gap-1 mx-auto"
                  >
                    <PlusCircle size={16} />
                    Add Account
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onDelete={() => setAccountToDelete(account)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <AlertDialog open={!!accountToDelete} onOpenChange={(open) => !open && setAccountToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the account <b>{accountToDelete?.account_name}</b>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAccountToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (accountToDelete) handleDeleteAccount(accountToDelete.id);
                setAccountToDelete(null);
              }}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const AccountCard = ({
  account,
  onDelete,
}: {
  account: FinancialAccount;
  onDelete: () => void;
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow relative">
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <CardTitle className="truncate flex-1 text-left">{account.account_name}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-destructive hover:bg-destructive/10 shrink-0"
        >
          <Trash2 size={16} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mt-1">
          <div className="text-2xl font-bold">${account.balance.toFixed(2)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Index;
