import { ExpressionSyntax, SyntaxKind, BinarySyntax, LiteralSyntax, UnarySyntax } from "@syntax/index.ts";
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
        return this.BindExpression(syntax);
      case SyntaxKind.UnaryExpression:
        return this.BindExpression(syntax);
      case SyntaxKind.BinaryExpression:
        return this.BindExpression(syntax);
      default:
        throw new Error(`Unexpected syntax ${syntax.Kind}`);
    }
  }

  BindExpression(syntax: ExpressionSyntax): BoundExpression {
    if (syntax instanceof LiteralSyntax) {
      const value = syntax.LiteralToken.Value;
      return new BoundLiteralExpression(typeof value === "number" ? value : 0);
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
          `Binary operator '${syntax.OperatorToken.Text}' is not defind for type ${boundLeft.Kind} and ${boundRight.Kind}`
        );
        return boundLeft;
      }

      return new BoundBinaryExpression(boundLeft, boundOperatorKind, boundRight);
    }

    throw new Error(``);
  }

  BindUnaryOperatorKind(kind: SyntaxKind, operandType: string): BoundUnaryOperatorKind | null {
    if (operandType !== "number") {
      return null;
    }

    switch (kind) {
      case SyntaxKind.PlusToken:
        return BoundUnaryOperatorKind.Identity;
      case SyntaxKind.MinusToken:
        return BoundUnaryOperatorKind.Negation;
      default:
        throw new Error(`Unexpected unary operator: ${kind}`);
    }
  }
  BindBinaryOperatorKind(kind: SyntaxKind, leftType: string, rightType: string): BoundBinaryOperatorKind | null {
    if (leftType !== "number") {
      return null;
    }

    if (rightType !== "number") {
      throw new Error(`Unexpected binary right oprand type: ${rightType}`);
    }

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
        throw new Error(`Unexpected binary operator: ${kind}`);
    }
  }
}

export { Binder };
