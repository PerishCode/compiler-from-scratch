import {
  ExpressionSyntax,
  SyntaxKind,
  BinarySyntax,
  LiteralSyntax,
  UnarySyntax,
  ParenthesisSyntax,
} from "@syntax/index.ts";
import { BoundExpression, BoundBinaryOperatorKind, BoundUnaryOperatorKind } from "@binding/types.ts";
import { BoundLiteralExpression } from "@binding/BoundLiteralExpression.ts";
import { BoundUnaryExpression } from "@binding/BoundUnaryExpression.ts";
import { BoundBinaryExpression } from "@binding/BoundBinaryExpression.ts";

class Binder {
  private readonly diagnostics: string[] = [];

  get Diagnostics(): readonly string[] {
    return this.diagnostics;
  }

  Bind(syntax: ExpressionSyntax): BoundExpression {
    switch (syntax.Kind) {
      case SyntaxKind.LiteralExpression:
      case SyntaxKind.UnaryExpression:
      case SyntaxKind.BinaryExpression:
      case SyntaxKind.ParenthesizedExpression:
        return this.BindExpression(syntax);

      default:
        throw new Error(`Unexpected syntax ${syntax.Kind}`);
    }
  }

  BindExpression(syntax: ExpressionSyntax): BoundExpression {
    if (syntax instanceof LiteralSyntax) {
      switch (typeof syntax.Value) {
        case "number":
          return new BoundLiteralExpression(syntax.Value);
        case "boolean":
          return new BoundLiteralExpression(syntax.Value);
        default:
          return new BoundLiteralExpression();
      }
    }

    if (syntax instanceof UnarySyntax) {
      const boundOperand = this.BindExpression(syntax.Operand);
      const boundOperatorKind = this.BindUnaryOperatorKind(syntax.OperatorToken.Kind, boundOperand.Type);

      if (boundOperatorKind === null) {
        this.diagnostics.push(
          `Unary operator '${syntax.OperatorToken.Text}' is not defind for type ${boundOperand.Type}`
        );
        return boundOperand;
      }

      return new BoundUnaryExpression(boundOperatorKind, boundOperand);
    }

    if (syntax instanceof BinarySyntax) {
      const boundLeft = this.BindExpression(syntax.Left);
      const boundRight = this.BindExpression(syntax.Right);
      const boundOperatorKind = this.BindBinaryOperatorKind(syntax.OperatorToken.Kind, boundLeft.Type, boundRight.Type);

      if (boundOperatorKind === null) {
        this.diagnostics.push(
          `Binary operator '${syntax.OperatorToken.Text}' is not defind for type ${boundLeft.Type} and ${boundRight.Type}`
        );
        return boundLeft;
      }

      return new BoundBinaryExpression(boundLeft, boundOperatorKind, boundRight);
    }

    if (syntax instanceof ParenthesisSyntax) {
      return this.BindExpression(syntax.Expression);
    }

    throw new Error(`Unexpected `);
  }

  BindUnaryOperatorKind(kind: SyntaxKind, operandType: string): BoundUnaryOperatorKind | null {
    switch (operandType) {
      case "number":
        switch (kind) {
          case SyntaxKind.PlusToken:
            return BoundUnaryOperatorKind.Identity;
          case SyntaxKind.MinusToken:
            return BoundUnaryOperatorKind.Negation;
          default:
            throw new Error(`Unexpected unary operator: ${kind} before type number`);
        }
      case "boolean":
        switch (kind) {
          case SyntaxKind.BangToken:
            return BoundUnaryOperatorKind.LogicalNegation;
          default:
            throw new Error(`Unexpected unary operator: ${kind} before type boolean`);
        }
      default:
        return null;
    }
  }

  BindBinaryOperatorKind(kind: SyntaxKind, leftType: string, rightType: string): BoundBinaryOperatorKind | null {
    if (leftType === "number" && rightType === "number") {
      switch (kind) {
        case SyntaxKind.PlusToken:
          return BoundBinaryOperatorKind.Addition;
        case SyntaxKind.MinusToken:
          return BoundBinaryOperatorKind.Subtraction;
        case SyntaxKind.StarToken:
          return BoundBinaryOperatorKind.Multiplication;
        case SyntaxKind.SlashToken:
          return BoundBinaryOperatorKind.Division;
        default:
          throw new Error(`Unexpected binary operator: ${kind} for number and number`);
      }
    }

    if (leftType === "boolean" && rightType === "boolean") {
      switch (kind) {
        case SyntaxKind.AndAndToken:
          return BoundBinaryOperatorKind.LogicalAnd;

        case SyntaxKind.PipePipeToken:
          return BoundBinaryOperatorKind.LogicalOr;

        default:
          throw new Error(`Unexpected binary operator: ${kind} for boolean and boolean`);
      }
    }

    return null;
  }
}

export { Binder };
