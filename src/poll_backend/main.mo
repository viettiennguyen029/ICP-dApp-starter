import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import RBTree "mo:base/RBTree";
import Text "mo:base/Text";

actor {
  var question : Text = "What is your favorite programing laguage ?";
  var votes : RBTree.RBTree<Text, Nat> = RBTree.RBTree(Text.compare);

  // query call mean that it does not change any data
  public query func getQuestion() : async Text {
    question;
  };

  public query func getVotes() : async [(Text, Nat)] {
    Iter.toArray(votes.entries());
  };

  public func vote(entry : Text) : async [(Text, Nat)] {
    // Check if entry is voted or not
    let votes_for_entry : ?Nat = votes.get(entry);

    let current_vote_for_entry : Nat = switch votes_for_entry {
      case null 0;
      case (?Nat) Nat;
    };

    // once we have the current number of votes, update new value
    votes.put(entry, current_vote_for_entry + 1);

    // return
    Iter.toArray(votes.entries());
  };

  public func resetVotes() : async [(Text, Nat)] {
    votes.put("Motoko", 0);
    votes.put("Rust", 0);
    votes.put("Type Script", 0);
    votes.put("Python", 0);

    // return
    Iter.toArray(votes.entries());
  };

};
